import { useState, useEffect, useCallback, useRef } from "react";
import type { DashboardState, ZoneData, AlertData, TrackData, ShiftSummary, DashboardConfig } from "@/types/warehouse";

const ZONE_LABELS = ["Loading Dock A", "Assembly Line B", "Storage Zone C"];
const ZONE_IDS = ["Z1", "Z2", "Z3"];
const REASONS = [
  "PROLONGED_IDLE",
  "REPEAT_RISK_EVENTS",
  "LOW_ACTIVITY_TREND",
  "No PPE detected",
  "Sustained awkward posture",
  "High repetition rate",
];

const DEFAULT_CONFIG: DashboardConfig = {
  idle_px_thresh: 5.0,
  idle_secs_trigger: 8.0,
  repeat_events_N: 6,
  repeat_window_secs: 600,
  fatigue_low: 39,
  fatigue_med: 69,
  process_every_n_frames: 2,
  resize_width: 960,
  max_fps: 15,
};

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
function randInt(min: number, max: number) {
  return Math.floor(rand(min, max + 1));
}
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateTrack(id: number): TrackData {
  const score = randInt(10, 95);
  const level = score <= 39 ? "Low" : score <= 69 ? "Medium" : "High";
  const speed = parseFloat(rand(0, 3).toFixed(1));
  const idleSecs = score > 50 ? rand(2, 45) : rand(0, 8);
  const repeatCount = score > 60 ? randInt(2, 12) : randInt(0, 3);
  const movementIntensity = parseFloat(rand(5, 160).toFixed(1));
  const lowActivityScore = parseFloat((1 - movementIntensity / 160).toFixed(2));

  const reasons: string[] = [];
  if (idleSecs > 8) reasons.push("PROLONGED_IDLE");
  if (repeatCount >= 6) reasons.push("REPEAT_RISK_EVENTS");
  if (lowActivityScore > 0.75) reasons.push("LOW_ACTIVITY_TREND");

  return {
    track_id: id,
    bbox: [randInt(50, 400), randInt(50, 300), randInt(50, 100), randInt(50, 100)],
    conf: parseFloat(rand(0.6, 0.98).toFixed(2)),
    centroid: [randInt(100, 500), randInt(100, 400)],
    speed,
    posture_event: null,
    ppe_event: null,
    fatigue_score: score,
    fatigue_level: level,
    repeated_unsafe: repeatCount >= 6,
    reasons,
    idle_total_secs: parseFloat(idleSecs.toFixed(1)),
    repeat_count: repeatCount,
    movement_intensity: movementIntensity,
    low_activity_score: lowActivityScore,
    active_seconds: parseFloat(rand(30, 300).toFixed(0)),
  };
}

function generateZone(idx: number): ZoneData {
  const trackCount = randInt(2, 7);
  const tracks = Array.from({ length: trackCount }, (_, i) => generateTrack(idx * 100 + i + 1));
  const avgFatigue = Math.round(tracks.reduce((s, t) => s + t.fatigue_score, 0) / tracks.length);

  return {
    zone_id: ZONE_IDS[idx],
    label: ZONE_LABELS[idx],
    avg_fatigue: avgFatigue,
    fatigue_distribution: {
      low: tracks.filter((t) => t.fatigue_level === "Low").length,
      medium: tracks.filter((t) => t.fatigue_level === "Medium").length,
      high: tracks.filter((t) => t.fatigue_level === "High").length,
    },
    repeat_unsafe_count: tracks.filter((t) => t.repeated_unsafe).length,
    risk_trend: pick(["Up", "Stable", "Down"]),
    active_tracks: trackCount,
    tracks,
  };
}

let alertCounter = 0;
function generateAlert(zones: ZoneData[]): AlertData {
  const zone = pick(zones);
  const track = pick(zone.tracks);
  alertCounter++;
  return {
    id: `alert-${alertCounter}`,
    timestamp: new Date(),
    zone_id: zone.zone_id,
    track_id: track.track_id,
    severity: track.fatigue_level,
    message: `${track.fatigue_level} fatigue on Track #${track.track_id} in ${zone.label}`,
    reasons: track.reasons.length > 0 ? track.reasons : [pick(REASONS)],
  };
}

const INITIAL_STATE: DashboardState = (() => {
  const zones = ZONE_IDS.map((_, i) => generateZone(i));
  return {
    active_tracks: zones.reduce((s, z) => s + z.active_tracks, 0),
    fatigue_alerts_30m: 0,
    repeated_unsafe_30m: 0,
    overall_risk_trend: "Stable" as const,
    zones,
    alerts: [],
    fatigue_history: [],
    shift_summary: {
      total_tracks_seen: 0,
      peak_fatigue: 0,
      peak_fatigue_time: "--:--:--",
      total_high_alerts: 0,
      total_repeat_unsafe: 0,
      avg_fatigue_shift: 0,
      top_risky_zone: "—",
      shift_duration_min: 0,
    },
    config: DEFAULT_CONFIG,
  };
})();

// WebSocket URL for your Python backend
const WS_URL = "ws://localhost:8765/ws/live";

export type ConnectionStatus = "connecting" | "connected" | "disconnected" | "simulation";

export function useWarehouseData() {
  const [data, setData] = useState<DashboardState>(INITIAL_STATE);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("connecting");
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout>>();
  const simulationTimer = useRef<ReturnType<typeof setInterval>>();
  const shiftRef = useRef({
    totalTracksSeen: new Set<number>(),
    peakFatigue: 0,
    peakFatigueTime: "--:--:--",
    totalHighAlerts: 0,
    totalRepeatUnsafe: 0,
    fatigueSum: 0,
    fatigueCount: 0,
    startTime: Date.now(),
  });

  // Parse WebSocket data from backend
  const parseBackendData = useCallback((raw: any): DashboardState => {
    // Map alerts timestamps from strings to Date objects
    const alerts: AlertData[] = (raw.alerts || []).map((a: any) => ({
      ...a,
      timestamp: new Date(),
    }));

    return {
      active_tracks: raw.active_tracks || 0,
      fatigue_alerts_30m: raw.fatigue_alerts_30m || 0,
      repeated_unsafe_30m: raw.repeated_unsafe_30m || 0,
      overall_risk_trend: raw.overall_risk_trend || "Stable",
      zones: raw.zones || [],
      alerts,
      fatigue_history: raw.fatigue_history || [],
      shift_summary: raw.shift_summary || INITIAL_STATE.shift_summary,
      config: raw.config || DEFAULT_CONFIG,
    };
  }, []);

  // Start simulation fallback
  const startSimulation = useCallback(() => {
    if (simulationTimer.current) return;
    setConnectionStatus("simulation");

    simulationTimer.current = setInterval(() => {
      setData((prev) => {
        const zones = ZONE_IDS.map((_, i) => {
          const old = prev.zones[i];
          const newZone = generateZone(i);
          newZone.avg_fatigue = Math.round(old.avg_fatigue * 0.7 + newZone.avg_fatigue * 0.3);
          return newZone;
        });

        const s = shiftRef.current;
        zones.forEach(z => z.tracks.forEach(t => {
          s.totalTracksSeen.add(t.track_id);
          s.fatigueSum += t.fatigue_score;
          s.fatigueCount++;
          if (t.fatigue_score > s.peakFatigue) {
            s.peakFatigue = t.fatigue_score;
            s.peakFatigueTime = new Date().toLocaleTimeString("en-US", { hour12: false });
          }
          if (t.fatigue_level === "High") s.totalHighAlerts++;
          if (t.repeated_unsafe) s.totalRepeatUnsafe++;
        }));

        const newAlerts = Math.random() > 0.5
          ? [generateAlert(zones), ...prev.alerts].slice(0, 50)
          : prev.alerts;

        const timeLabel = new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
        const history = [...prev.fatigue_history, {
          time: timeLabel,
          overall: Math.round(zones.reduce((sum, z) => sum + z.avg_fatigue, 0) / zones.length),
          Z1: zones[0].avg_fatigue,
          Z2: zones[1].avg_fatigue,
          Z3: zones[2].avg_fatigue,
        }].slice(-60);

        let trend: "Up" | "Stable" | "Down" = "Stable";
        if (history.length >= 6) {
          const recent = history.slice(-6).map(h => h.overall);
          if (recent[recent.length - 1] - recent[0] > 5) trend = "Up";
          else if (recent[0] - recent[recent.length - 1] > 5) trend = "Down";
        }

        const riskiest = zones.reduce((a, b) => a.avg_fatigue > b.avg_fatigue ? a : b);

        return {
          active_tracks: zones.reduce((sum, z) => sum + z.active_tracks, 0),
          fatigue_alerts_30m: Math.max(0, prev.fatigue_alerts_30m + (Math.random() > 0.6 ? 1 : Math.random() > 0.8 ? -1 : 0)),
          repeated_unsafe_30m: Math.max(0, prev.repeated_unsafe_30m + (Math.random() > 0.7 ? 1 : Math.random() > 0.8 ? -1 : 0)),
          overall_risk_trend: trend,
          zones,
          alerts: newAlerts,
          fatigue_history: history,
          shift_summary: {
            total_tracks_seen: s.totalTracksSeen.size,
            peak_fatigue: s.peakFatigue,
            peak_fatigue_time: s.peakFatigueTime,
            total_high_alerts: Math.min(s.totalHighAlerts, 999),
            total_repeat_unsafe: Math.min(s.totalRepeatUnsafe, 999),
            avg_fatigue_shift: s.fatigueCount > 0 ? Math.round(s.fatigueSum / s.fatigueCount) : 0,
            top_risky_zone: riskiest.label,
            shift_duration_min: Math.round((Date.now() - s.startTime) / 60000),
          },
          config: prev.config,
        };
      });
    }, 1000);
  }, []);

  const stopSimulation = useCallback(() => {
    if (simulationTimer.current) {
      clearInterval(simulationTimer.current);
      simulationTimer.current = undefined;
    }
  }, []);

  // WebSocket connection
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    setConnectionStatus("connecting");
    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnectionStatus("connected");
      stopSimulation();
      console.log("[WARESPY] Connected to backend at", WS_URL);
    };

    ws.onmessage = (event) => {
      try {
        const raw = JSON.parse(event.data);
        if (raw.active_tracks !== undefined) {
          setData(parseBackendData(raw));
        }
      } catch (e) {
        console.warn("[WARESPY] Failed to parse WS message:", e);
      }
    };

    ws.onclose = () => {
      setConnectionStatus("disconnected");
      console.log("[WARESPY] WebSocket disconnected. Falling back to simulation...");
      startSimulation();
      // Reconnect attempt
      reconnectTimer.current = setTimeout(connect, 5000);
    };

    ws.onerror = () => {
      ws.close();
    };
  }, [parseBackendData, startSimulation, stopSimulation]);

  useEffect(() => {
    // Try connecting to backend first
    connect();

    // If no connection after 3s, start simulation
    const fallbackTimer = setTimeout(() => {
      if (wsRef.current?.readyState !== WebSocket.OPEN) {
        startSimulation();
      }
    }, 3000);

    return () => {
      clearTimeout(fallbackTimer);
      clearTimeout(reconnectTimer.current);
      stopSimulation();
      wsRef.current?.close();
    };
  }, [connect, startSimulation, stopSimulation]);

  return { ...data, connectionStatus };
}
