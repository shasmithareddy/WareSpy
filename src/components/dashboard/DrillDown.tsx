import type { ZoneData, TrackData } from "@/types/warehouse";
import { X } from "lucide-react";
import { useState } from "react";

interface DrillDownProps {
  zone: ZoneData;
  onClose: () => void;
}

function riskColor(level: string) {
  if (level === "High") return "text-destructive";
  if (level === "Medium") return "text-primary";
  return "text-green-400";
}

export default function DrillDown({ zone, onClose }: DrillDownProps) {
  const [selectedTrack, setSelectedTrack] = useState<TrackData | null>(null);

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="px-4 py-2 border-b border-border flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Drill-Down: {zone.label}
        </span>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {!selectedTrack ? (
        <div className="max-h-[250px] overflow-y-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border font-mono text-[9px] uppercase text-muted-foreground">
                <th className="px-3 py-1.5 text-left">Track</th>
                <th className="px-3 py-1.5 text-right">Fatigue</th>
                <th className="px-3 py-1.5 text-center">Level</th>
                <th className="px-3 py-1.5 text-right">Speed</th>
                <th className="px-3 py-1.5 text-center">Unsafe</th>
              </tr>
            </thead>
            <tbody>
              {zone.tracks.map((t) => (
                <tr
                  key={t.track_id}
                  onClick={() => setSelectedTrack(t)}
                  className="border-b border-border cursor-pointer hover:bg-muted/50"
                >
                  <td className="px-3 py-2 font-mono text-foreground">#{t.track_id}</td>
                  <td className="px-3 py-2 text-right font-mono font-bold text-foreground">{t.fatigue_score}</td>
                  <td className={`px-3 py-2 text-center font-mono font-bold ${riskColor(t.fatigue_level)}`}>{t.fatigue_level}</td>
                  <td className="px-3 py-2 text-right font-mono text-muted-foreground">{t.speed} px/s</td>
                  <td className="px-3 py-2 text-center">
                    {t.repeated_unsafe ? (
                      <span className="px-1.5 py-0.5 text-[9px] font-mono rounded bg-destructive/20 text-destructive">YES</span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-4 space-y-3">
          <button
            onClick={() => setSelectedTrack(null)}
            className="text-[10px] font-mono text-primary hover:underline"
          >
            ← Back to track list
          </button>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted rounded p-3">
              <span className="font-mono text-[9px] text-muted-foreground uppercase">Track ID</span>
              <p className="font-mono text-lg font-bold text-foreground">#{selectedTrack.track_id}</p>
            </div>
            <div className="bg-muted rounded p-3">
              <span className="font-mono text-[9px] text-muted-foreground uppercase">Fatigue</span>
              <p className={`font-mono text-lg font-bold ${riskColor(selectedTrack.fatigue_level)}`}>
                {selectedTrack.fatigue_score} ({selectedTrack.fatigue_level})
              </p>
            </div>
            <div className="bg-muted rounded p-3">
              <span className="font-mono text-[9px] text-muted-foreground uppercase">Speed</span>
              <p className="font-mono text-lg font-bold text-foreground">{selectedTrack.speed} px/s</p>
            </div>
            <div className="bg-muted rounded p-3">
              <span className="font-mono text-[9px] text-muted-foreground uppercase">Confidence</span>
              <p className="font-mono text-lg font-bold text-foreground">{selectedTrack.conf}</p>
            </div>
          </div>
          {selectedTrack.reasons.length > 0 && (
            <div>
              <span className="font-mono text-[9px] text-muted-foreground uppercase">Reason Codes</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedTrack.reasons.map((r, i) => (
                  <span key={i} className="text-[9px] font-mono bg-destructive/15 text-destructive px-2 py-0.5 rounded">{r}</span>
                ))}
              </div>
            </div>
          )}
          {selectedTrack.posture_event && (
            <div>
              <span className="font-mono text-[9px] text-muted-foreground uppercase">Posture Event</span>
              <p className="font-mono text-xs text-accent mt-0.5">{selectedTrack.posture_event}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
