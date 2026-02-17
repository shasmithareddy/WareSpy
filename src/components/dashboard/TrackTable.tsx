import type { TrackData } from "@/types/warehouse";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface TrackTableProps {
  tracks: TrackData[];
}

function barColor(score: number) {
  if (score <= 39) return "#50c878";
  if (score <= 69) return "#edcb96";
  return "#ff4444";
}

export default function TrackTable({ tracks }: TrackTableProps) {
  const sorted = [...tracks].sort((a, b) => b.fatigue_score - a.fatigue_score);
  const chartData = sorted.slice(0, 12).map((t) => ({
    name: `#${t.track_id}`,
    score: t.fatigue_score,
    rep: t.repeat_count,
  }));

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="px-4 py-2 border-b border-border flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Track Fatigue Overview</span>
        <span className="font-mono text-[9px] text-muted-foreground">{tracks.length} tracks</span>
      </div>

      {/* Mini bar chart */}
      <div className="px-2 pt-2">
        <ResponsiveContainer width="100%" height={100}>
          <BarChart data={chartData} barSize={14}>
            <XAxis dataKey="name" tick={{ fontSize: 8, fill: "hsl(37 30% 65%)" }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 8, fill: "hsl(37 30% 65%)" }} width={25} />
            <Tooltip
              contentStyle={{ background: "hsl(282 43% 16%)", border: "1px solid hsl(282 30% 25%)", fontSize: 10, fontFamily: "JetBrains Mono" }}
            />
            <Bar dataKey="score" name="Fatigue">
              {chartData.map((entry, i) => (
                <Cell key={i} fill={barColor(entry.score)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className="max-h-[200px] overflow-y-auto">
        <table className="w-full text-[10px]">
          <thead>
            <tr className="border-b border-border font-mono uppercase text-muted-foreground">
              <th className="px-3 py-1.5 text-left">Track</th>
              <th className="px-2 py-1.5 text-right">Fat.</th>
              <th className="px-2 py-1.5 text-center">Level</th>
              <th className="px-2 py-1.5 text-right">Rep</th>
              <th className="px-2 py-1.5 text-right">Spd</th>
              <th className="px-2 py-1.5 text-right">Idle(s)</th>
              <th className="px-2 py-1.5 text-left">Reasons</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((t) => (
              <tr key={t.track_id} className="border-b border-border hover:bg-muted/30">
                <td className="px-3 py-1.5 font-mono text-foreground font-bold">#{t.track_id}</td>
                <td className="px-2 py-1.5 text-right font-mono font-bold text-foreground">{t.fatigue_score}</td>
                <td className={`px-2 py-1.5 text-center font-mono font-bold ${
                  t.fatigue_level === "High" ? "text-destructive" : t.fatigue_level === "Medium" ? "text-primary" : "text-green-400"
                }`}>{t.fatigue_level.toUpperCase()}</td>
                <td className="px-2 py-1.5 text-right font-mono text-accent">{t.repeat_count}</td>
                <td className="px-2 py-1.5 text-right font-mono text-muted-foreground">{t.speed}</td>
                <td className="px-2 py-1.5 text-right font-mono text-muted-foreground">{t.idle_total_secs}</td>
                <td className="px-2 py-1.5 text-left">
                  <div className="flex gap-0.5 flex-wrap">
                    {t.reasons.slice(0, 2).map((r, i) => (
                      <span key={i} className="text-[8px] font-mono bg-muted px-1 py-0.5 rounded text-muted-foreground truncate max-w-[80px]">{r}</span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
