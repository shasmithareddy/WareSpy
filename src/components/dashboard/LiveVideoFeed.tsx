import { useRef, useEffect, useState } from "react";
import type { ConnectionStatus } from "@/hooks/useWarehouseData";
import warehouseVideo from "@/assets/warehouse-feed.mp4";

interface DrawTrack {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  fatigue: number;
  level: string;
  repeated: boolean;
  repeatCount: number;
  speed: number;
  idleSecs: number;
}

interface LiveVideoFeedProps {
  connectionStatus: ConnectionStatus;
}

const ZONES = [
  { id: "Z1", label: "Loading Dock A", x: 0, y: 0, w: 0.33, h: 1, color: "rgba(237,203,150,0.10)" },
  { id: "Z2", label: "Assembly B", x: 0.33, y: 0, w: 0.34, h: 1, color: "rgba(193,145,161,0.10)" },
  { id: "Z3", label: "Storage C", x: 0.67, y: 0, w: 0.33, h: 1, color: "rgba(49,59,114,0.15)" },
];

const MJPEG_URL = "http://localhost:8765/video_feed";

function riskColor(level: string) {
  if (level === "HIGH") return "#ff4444";
  if (level === "MEDIUM") return "#edcb96";
  return "#50c878";
}

export default function LiveVideoFeed({ connectionStatus }: LiveVideoFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tracksRef = useRef<DrawTrack[]>([]);
  const animRef = useRef<number>(0);
  const [ready, setReady] = useState(false);
  const frameCountRef = useRef(0);
  const isLive = connectionStatus === "connected";

  // Simulated tracks (only used in simulation mode)
  useEffect(() => {
    if (isLive) return;

    const tracks: DrawTrack[] = Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      x: Math.random() * 520 + 50,
      y: Math.random() * 300 + 60,
      w: 36 + Math.random() * 18,
      h: 70 + Math.random() * 30,
      fatigue: Math.floor(Math.random() * 80 + 10),
      level: ["LOW", "MEDIUM", "HIGH"][Math.floor(Math.random() * 3)],
      repeated: Math.random() > 0.6,
      repeatCount: Math.floor(Math.random() * 10),
      speed: parseFloat((Math.random() * 120).toFixed(1)),
      idleSecs: parseFloat((Math.random() * 20).toFixed(1)),
    }));
    tracksRef.current = tracks;

    const moveInterval = setInterval(() => {
      tracksRef.current = tracksRef.current.map((t) => {
        const newFatigue = Math.max(5, Math.min(99, t.fatigue + Math.floor((Math.random() - 0.45) * 3)));
        return {
          ...t,
          x: Math.max(20, Math.min(600, t.x + (Math.random() - 0.5) * 5)),
          y: Math.max(30, Math.min(420, t.y + (Math.random() - 0.5) * 3)),
          fatigue: newFatigue,
          level: newFatigue <= 39 ? "LOW" : newFatigue <= 69 ? "MEDIUM" : "HIGH",
          speed: parseFloat((Math.random() * 160).toFixed(1)),
          repeatCount: Math.max(0, t.repeatCount + (Math.random() > 0.8 ? 1 : 0)),
          repeated: t.repeatCount >= 6,
          idleSecs: parseFloat((t.idleSecs + (Math.random() > 0.7 ? 0.2 : -0.1)).toFixed(1)),
        };
      });
    }, 200);

    return () => clearInterval(moveInterval);
  }, [isLive]);

  // Canvas overlay rendering (simulation mode)
  useEffect(() => {
    if (isLive) return;

    const draw = () => {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const W = canvas.width;
      const H = canvas.height;
      frameCountRef.current++;

      ctx.clearRect(0, 0, W, H);

      if (video && ready && video.readyState >= 2) {
        ctx.drawImage(video, 0, 0, W, H);
        ctx.fillStyle = "rgba(26, 15, 34, 0.30)";
        ctx.fillRect(0, 0, W, H);
      } else {
        ctx.fillStyle = "#1a0f22";
        ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = "rgba(237,203,150,0.04)";
        ctx.lineWidth = 1;
        for (let x = 0; x < W; x += 40) {
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
        }
        for (let y = 0; y < H; y += 40) {
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
        }
      }

      ZONES.forEach((z) => {
        ctx.fillStyle = z.color;
        ctx.fillRect(z.x * W, z.y * H, z.w * W, z.h * H);
        ctx.strokeStyle = "rgba(237,203,150,0.18)";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(z.x * W, z.y * H, z.w * W, z.h * H);
        ctx.setLineDash([]);
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(z.x * W + 2, z.y * H + 2, 90, 16);
        ctx.fillStyle = "rgba(237,203,150,0.7)";
        ctx.font = "bold 10px 'JetBrains Mono', monospace";
        ctx.fillText(z.label, z.x * W + 5, z.y * H + 13);
      });

      tracksRef.current.forEach((t) => {
        const color = riskColor(t.level);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.strokeRect(t.x, t.y, t.w, t.h);

        const label = `ID ${t.id} | FAT ${t.fatigue} ${t.level} | REP ${t.repeatCount}`;
        const labelW = ctx.measureText(label).width + 8;
        ctx.fillStyle = "rgba(0,0,0,0.75)";
        ctx.fillRect(t.x, Math.max(0, t.y - 16), labelW, 16);
        ctx.fillStyle = color;
        ctx.font = "bold 9px 'JetBrains Mono', monospace";
        ctx.fillText(label, t.x + 4, Math.max(11, t.y - 4));

        const subLabel = `SPD:${t.speed.toFixed(0)}px/s IDLE:${t.idleSecs.toFixed(0)}s`;
        const subW = ctx.measureText(subLabel).width + 8;
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(t.x, t.y + t.h + 2, subW, 13);
        ctx.fillStyle = "rgba(237,203,150,0.8)";
        ctx.font = "8px 'JetBrains Mono', monospace";
        ctx.fillText(subLabel, t.x + 4, t.y + t.h + 12);

        if (t.repeated) {
          ctx.fillStyle = "rgba(255,68,68,0.9)";
          ctx.beginPath();
          ctx.arc(t.x + t.w + 6, t.y, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "#fff";
          ctx.font = "bold 6px sans-serif";
          ctx.fillText("!", t.x + t.w + 4, t.y + 2);
        }
      });

      const now = new Date().toLocaleTimeString("en-US", { hour12: false });
      const highCount = tracksRef.current.filter((t) => t.level === "HIGH").length;
      const medCount = tracksRef.current.filter((t) => t.level === "MEDIUM").length;
      const repCount = tracksRef.current.filter((t) => t.repeated).length;

      ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.fillRect(0, H - 52, 260, 52);
      ctx.fillStyle = "#edcb96";
      ctx.font = "bold 11px 'JetBrains Mono', monospace";
      ctx.fillText(`TRACKS: ${tracksRef.current.length}  |  ${now}`, 8, H - 36);
      ctx.fillStyle = "#ff4444";
      ctx.font = "10px 'JetBrains Mono', monospace";
      ctx.fillText(`HIGH: ${highCount}  MED: ${medCount}  REPEAT: ${repCount}`, 8, H - 22);
      ctx.fillStyle = "rgba(237,203,150,0.5)";
      ctx.font = "9px 'JetBrains Mono', monospace";
      ctx.fillText(`Frame: ${frameCountRef.current}  |  SIMULATION MODE`, 8, H - 8);

      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(W - 160, 0, 160, 28);
      ctx.fillStyle = "rgba(237,203,150,0.6)";
      ctx.font = "9px 'JetBrains Mono', monospace";
      ctx.fillText("YOLOv8n + IoU Tracker", W - 154, 12);
      ctx.fillText("Person 3: Fatigue Module", W - 154, 23);

      const scanY = ((Date.now() % 5000) / 5000) * H;
      ctx.strokeStyle = "rgba(237,203,150,0.06)";
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, scanY); ctx.lineTo(W, scanY); ctx.stroke();

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [ready, isLive]);

  const statusLabel = {
    connected: { text: "LIVE — Backend Connected", color: "bg-green-500" },
    connecting: { text: "Connecting to backend...", color: "bg-yellow-500" },
    disconnected: { text: "Backend Offline — Reconnecting...", color: "bg-destructive" },
    simulation: { text: "SIMULATION MODE — Start backend for live data", color: "bg-accent" },
  }[connectionStatus];

  return (
    <div className="relative rounded-lg overflow-hidden border border-border bg-card">
      {/* Status badge */}
      <div className="absolute top-2 left-2 z-10 flex items-center gap-2">
        <span className={`inline-block w-2 h-2 rounded-full ${statusLabel.color} animate-pulse-glow`} />
        <span className="font-mono text-[10px] text-primary uppercase tracking-widest">
          {isLive ? "Live Feed — Backend" : "Live Feed — Warehouse Cam 1"}
        </span>
      </div>

      {/* Connection status bar */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className={`flex items-center gap-2 px-3 py-1.5 ${
          isLive ? "bg-green-900/80" : connectionStatus === "simulation" ? "bg-muted/90" : "bg-destructive/30"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${statusLabel.color}`} />
          <span className="font-mono text-[9px] text-foreground">{statusLabel.text}</span>
        </div>
      </div>

      {isLive ? (
        /* LIVE MODE: Show MJPEG stream from backend */
        <img
          src={MJPEG_URL}
          alt="Live MJPEG Feed"
          className="w-full aspect-[4/3] object-cover"
        />
      ) : (
        /* SIMULATION MODE: Canvas overlay on local video */
        <>
          <video
            ref={videoRef}
            src={warehouseVideo}
            autoPlay
            loop
            muted
            playsInline
            onCanPlay={() => setReady(true)}
            className="hidden"
          />
          <canvas ref={canvasRef} width={640} height={480} className="w-full h-full aspect-[4/3]" />
        </>
      )}
    </div>
  );
}
