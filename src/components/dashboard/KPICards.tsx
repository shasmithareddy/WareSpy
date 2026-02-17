import { Activity, AlertTriangle, ShieldAlert, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KPICardsProps {
  activeTracks: number;
  fatigueAlerts: number;
  repeatedUnsafe: number;
  riskTrend: "Up" | "Stable" | "Down";
}

const trendIcon = (t: string) => {
  if (t === "Up") return <TrendingUp className="w-4 h-4 text-destructive" />;
  if (t === "Down") return <TrendingDown className="w-4 h-4 text-green-400" />;
  return <Minus className="w-4 h-4 text-muted-foreground" />;
};

export default function KPICards({ activeTracks, fatigueAlerts, repeatedUnsafe, riskTrend }: KPICardsProps) {
  const cards = [
    { label: "Active Tracks", value: activeTracks, icon: <Activity className="w-5 h-5 text-primary" />, glow: "" },
    { label: "Fatigue Alerts (30m)", value: fatigueAlerts, icon: <AlertTriangle className="w-5 h-5 text-accent" />, glow: fatigueAlerts > 10 ? "glow-rose" : "" },
    { label: "Repeated Unsafe (30m)", value: repeatedUnsafe, icon: <ShieldAlert className="w-5 h-5 text-destructive" />, glow: repeatedUnsafe > 5 ? "glow-alert" : "" },
    { label: "Risk Trend", value: riskTrend, icon: trendIcon(riskTrend), glow: riskTrend === "Up" ? "glow-alert" : "" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((c) => (
        <div key={c.label} className={`rounded-lg border border-border bg-card p-4 flex flex-col gap-1 ${c.glow}`}>
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{c.label}</span>
            {c.icon}
          </div>
          <span className="text-2xl font-bold font-mono text-foreground">{c.value}</span>
        </div>
      ))}
    </div>
  );
}
