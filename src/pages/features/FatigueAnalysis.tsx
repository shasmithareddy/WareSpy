import { useState } from "react";
import { useWarehouseData } from "@/hooks/useWarehouseData";
import LiveVideoFeed from "@/components/dashboard/LiveVideoFeed";
import KPICards from "@/components/dashboard/KPICards";
import FatigueCharts from "@/components/dashboard/FatigueCharts";
import ZoneTable from "@/components/dashboard/ZoneTable";
import AlertsPanel from "@/components/dashboard/AlertsPanel";
import DrillDown from "@/components/dashboard/DrillDown";
import ShiftSummaryPanel from "@/components/dashboard/ShiftSummaryPanel";
import TrackTable from "@/components/dashboard/TrackTable";
import ConfigPanel from "@/components/dashboard/ConfigPanel";
import { Shield, Cpu, Wifi, WifiOff } from "lucide-react";

const Index = () => {
  const { connectionStatus, ...data } = useWarehouseData();
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  const drillZone = data.zones.find((z) => z.zone_id === selectedZone);
  const allTracks = data.zones.flatMap((z) => z.tracks);

  const isLive = connectionStatus === "connected";

  return (
    <div className="min-h-screen bg-background p-2 lg:p-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center">
            <Shield className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-bold font-mono text-foreground tracking-wide uppercase">
              WARESPY — Fatigue & Temporal Analysis
            </h1>
            <p className="text-[10px] font-mono text-muted-foreground">Live Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Backend status indicator */}
          <div className={`flex items-center gap-1.5 border rounded px-2.5 py-1 ${
            isLive ? "bg-green-900/30 border-green-700" : "bg-card border-border"
          }`}>
            {isLive ? <Wifi className="w-3 h-3 text-green-400" /> : <WifiOff className="w-3 h-3 text-muted-foreground" />}
            <span className={`font-mono text-[9px] ${isLive ? "text-green-400" : "text-muted-foreground"}`}>
              {isLive ? "BACKEND LIVE" : connectionStatus === "simulation" ? "SIMULATION" : "CONNECTING..."}
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-card border border-border rounded px-2.5 py-1">
            <Cpu className="w-3 h-3 text-muted-foreground" />
            <span className="font-mono text-[9px] text-muted-foreground">YOLOv8n</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full animate-pulse-glow" style={{ background: "hsl(142 69% 58%)" }} />
            <span className="font-mono text-[10px] text-muted-foreground">SYSTEM ONLINE</span>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <KPICards
        activeTracks={data.active_tracks}
        fatigueAlerts={data.fatigue_alerts_30m}
        repeatedUnsafe={data.repeated_unsafe_30m}
        riskTrend={data.overall_risk_trend}
      />

      {/* Row 1: Video + Alerts + Shift Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 mt-2">
        <div className="lg:col-span-7">
          <LiveVideoFeed connectionStatus={connectionStatus} />
        </div>
        <div className="lg:col-span-3">
          <AlertsPanel alerts={data.alerts} />
        </div>
        <div className="lg:col-span-2 flex flex-col gap-2">
          <ShiftSummaryPanel summary={data.shift_summary} />
          <ConfigPanel config={data.config} />
        </div>
      </div>

      {/* Row 2: Charts + Track Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 mt-2">
        <div className="lg:col-span-8">
          <FatigueCharts history={data.fatigue_history} zones={data.zones} />
        </div>
        <div className="lg:col-span-4">
          <TrackTable tracks={allTracks} />
        </div>
      </div>

      {/* Row 3: Zone table + drill down */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mt-2">
        <ZoneTable zones={data.zones} onSelectZone={setSelectedZone} selectedZone={selectedZone} />
        {drillZone ? (
          <DrillDown zone={drillZone} onClose={() => setSelectedZone(null)} />
        ) : (
          <div className="rounded-lg border border-border bg-card flex items-center justify-center p-8">
            <span className="font-mono text-[10px] text-muted-foreground uppercase">Select a zone to drill down</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-3 pb-2 flex items-center justify-between">
        <span className="font-mono text-[9px] text-muted-foreground">
          WARESPY © 2024 — Privacy-first warehouse intelligence
        </span>
        <span className="font-mono text-[9px] text-muted-foreground">
          {isLive ? "🟢 Real-time data from Python backend" : "🟡 Simulation mode — run backend_server.py for live data"}
        </span>
      </div>
    </div>
  );
};

export default Index;
