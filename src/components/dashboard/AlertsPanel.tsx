import type { AlertData } from "@/types/warehouse";
import { AlertTriangle } from "lucide-react";

interface AlertsPanelProps {
  alerts: AlertData[];
}

function severityStyle(s: string) {
  if (s === "High") return "border-l-destructive text-destructive";
  if (s === "Medium") return "border-l-primary text-primary";
  return "border-l-green-400 text-green-400";
}

export default function AlertsPanel({ alerts }: AlertsPanelProps) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="px-4 py-2 border-b border-border flex items-center gap-2">
        <AlertTriangle className="w-3.5 h-3.5 text-accent" />
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Live Alerts</span>
        <span className="ml-auto font-mono text-[10px] text-muted-foreground">{alerts.length} total</span>
      </div>
      <div className="max-h-[280px] overflow-y-auto">
        {alerts.length === 0 && (
          <div className="p-4 text-center text-muted-foreground text-xs font-mono">No alerts yet…</div>
        )}
        {alerts.map((a) => (
          <div key={a.id} className={`px-4 py-2.5 border-b border-border border-l-2 ${severityStyle(a.severity)}`}>
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold">{a.severity}</span>
              <span className="font-mono text-[9px] text-muted-foreground">
                {a.timestamp.toLocaleTimeString("en-US", { hour12: false })}
              </span>
            </div>
            <p className="text-xs text-foreground mt-0.5">{a.message}</p>
            <div className="flex gap-1 mt-1 flex-wrap">
              {a.reasons.map((r, i) => (
                <span key={i} className="text-[9px] font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground">{r}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
