import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import type { ZoneData } from "@/types/warehouse";
import { useState } from "react";

interface FatigueChartsProps {
  history: { time: string; overall: number; Z1: number; Z2: number; Z3: number }[];
  zones: ZoneData[];
}

const PIE_COLORS = ["#8ac78a", "#edcb96", "#ff4444"];

export default function FatigueCharts({ history, zones }: FatigueChartsProps) {
  const [selectedZone, setSelectedZone] = useState<string>("overall");

  const totalDist = zones.reduce(
    (acc, z) => ({
      low: acc.low + z.fatigue_distribution.low,
      medium: acc.medium + z.fatigue_distribution.medium,
      high: acc.high + z.fatigue_distribution.high,
    }),
    { low: 0, medium: 0, high: 0 }
  );

  const pieData = [
    { name: "Low", value: totalDist.low },
    { name: "Medium", value: totalDist.medium },
    { name: "High", value: totalDist.high },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
      {/* Line Chart */}
      <div className="lg:col-span-2 rounded-lg border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Fatigue Score Trend</span>
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="bg-muted text-foreground text-xs font-mono px-2 py-1 rounded border border-border"
          >
            <option value="overall">Overall</option>
            <option value="Z1">Zone 1</option>
            <option value="Z2">Zone 2</option>
            <option value="Z3">Zone 3</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(282 30% 25%)" />
            <XAxis dataKey="time" tick={{ fontSize: 9, fill: "hsl(37 30% 65%)" }} interval="preserveStartEnd" />
            <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: "hsl(37 30% 65%)" }} />
            <Tooltip
              contentStyle={{ background: "hsl(282 43% 16%)", border: "1px solid hsl(282 30% 25%)", fontSize: 11, fontFamily: "JetBrains Mono" }}
              labelStyle={{ color: "hsl(37 72% 76%)" }}
            />
            {selectedZone === "overall" ? (
              <>
                <Line type="monotone" dataKey="overall" stroke="#edcb96" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Z1" stroke="#c191a1" strokeWidth={1} dot={false} opacity={0.5} />
                <Line type="monotone" dataKey="Z2" stroke="#313b72" strokeWidth={1} dot={false} opacity={0.5} />
                <Line type="monotone" dataKey="Z3" stroke="#8ac78a" strokeWidth={1} dot={false} opacity={0.5} />
              </>
            ) : (
              <Line type="monotone" dataKey={selectedZone} stroke="#edcb96" strokeWidth={2} dot={false} />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="rounded-lg border border-border bg-card p-4">
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Fatigue Distribution</span>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
              {pieData.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ background: "hsl(282 43% 16%)", border: "1px solid hsl(282 30% 25%)", fontSize: 11, fontFamily: "JetBrains Mono" }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-4 mt-1">
          {pieData.map((d, i) => (
            <div key={d.name} className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i] }} />
              <span className="font-mono text-[9px] text-muted-foreground">{d.name} ({d.value})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
