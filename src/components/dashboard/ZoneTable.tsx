import type { ZoneData } from "@/types/warehouse";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface ZoneTableProps {
  zones: ZoneData[];
  onSelectZone: (zoneId: string) => void;
  selectedZone: string | null;
}

function riskBadge(avg: number) {
  if (avg >= 70) return <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-destructive/20 text-destructive font-bold">HIGH</span>;
  if (avg >= 40) return <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-primary/20 text-primary font-bold">MED</span>;
  return <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-green-500/20 text-green-400 font-bold">LOW</span>;
}

function trendIcon(t: string) {
  if (t === "Up") return <TrendingUp className="w-3.5 h-3.5 text-destructive" />;
  if (t === "Down") return <TrendingDown className="w-3.5 h-3.5 text-green-400" />;
  return <Minus className="w-3.5 h-3.5 text-muted-foreground" />;
}

export default function ZoneTable({ zones, onSelectZone, selectedZone }: ZoneTableProps) {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="px-4 py-2 border-b border-border">
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Zone Summary</span>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-muted-foreground font-mono text-[10px] uppercase">
            <th className="px-4 py-2 text-left">Zone</th>
            <th className="px-3 py-2 text-right">Avg Fatigue</th>
            <th className="px-3 py-2 text-right">Unsafe</th>
            <th className="px-3 py-2 text-center">Trend</th>
            <th className="px-3 py-2 text-center">Risk</th>
            <th className="px-3 py-2 text-right">Tracks</th>
          </tr>
        </thead>
        <tbody>
          {zones.map((z) => (
            <tr
              key={z.zone_id}
              onClick={() => onSelectZone(z.zone_id)}
              className={`border-b border-border cursor-pointer transition-colors hover:bg-muted/50 ${selectedZone === z.zone_id ? "bg-muted/70" : ""}`}
            >
              <td className="px-4 py-2.5 font-mono text-xs text-foreground">{z.label}</td>
              <td className="px-3 py-2.5 text-right font-mono text-xs text-foreground font-bold">{z.avg_fatigue}</td>
              <td className="px-3 py-2.5 text-right font-mono text-xs text-accent">{z.repeat_unsafe_count}</td>
              <td className="px-3 py-2.5 text-center">{trendIcon(z.risk_trend)}</td>
              <td className="px-3 py-2.5 text-center">{riskBadge(z.avg_fatigue)}</td>
              <td className="px-3 py-2.5 text-right font-mono text-xs text-muted-foreground">{z.active_tracks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
