import type { ShiftSummary } from "@/types/warehouse";
import { Clock, Users, Flame, AlertTriangle, BarChart3, MapPin } from "lucide-react";

interface ShiftSummaryPanelProps {
  summary: ShiftSummary;
}

export default function ShiftSummaryPanel({ summary }: ShiftSummaryPanelProps) {
  const items = [
    { label: "Shift Duration", value: `${summary.shift_duration_min} min`, icon: <Clock className="w-3.5 h-3.5 text-primary" /> },
    { label: "Total Tracks Seen", value: summary.total_tracks_seen, icon: <Users className="w-3.5 h-3.5 text-primary" /> },
    { label: "Peak Fatigue", value: `${summary.peak_fatigue} @ ${summary.peak_fatigue_time}`, icon: <Flame className="w-3.5 h-3.5 text-destructive" /> },
    { label: "Avg Fatigue (Shift)", value: summary.avg_fatigue_shift, icon: <BarChart3 className="w-3.5 h-3.5 text-accent" /> },
    { label: "High Alerts Total", value: summary.total_high_alerts, icon: <AlertTriangle className="w-3.5 h-3.5 text-destructive" /> },
    { label: "Top Risky Zone", value: summary.top_risky_zone, icon: <MapPin className="w-3.5 h-3.5 text-accent" /> },
  ];

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="px-4 py-2 border-b border-border">
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Shift Summary</span>
      </div>
      <div className="grid grid-cols-2 gap-px bg-border">
        {items.map((item) => (
          <div key={item.label} className="bg-card px-3 py-2.5 flex flex-col gap-0.5">
            <div className="flex items-center gap-1.5">
              {item.icon}
              <span className="font-mono text-[9px] uppercase text-muted-foreground">{item.label}</span>
            </div>
            <span className="font-mono text-sm font-bold text-foreground truncate">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
