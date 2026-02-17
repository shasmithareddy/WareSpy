import type { DashboardConfig } from "@/types/warehouse";
import { Settings } from "lucide-react";

interface ConfigPanelProps {
  config: DashboardConfig;
}

export default function ConfigPanel({ config }: ConfigPanelProps) {
  const items = [
    { label: "Idle Threshold", value: `${config.idle_px_thresh} px` },
    { label: "Idle Trigger", value: `${config.idle_secs_trigger}s` },
    { label: "Repeat Threshold N", value: config.repeat_events_N },
    { label: "Repeat Window", value: `${config.repeat_window_secs}s` },
    { label: "Fatigue Low ≤", value: config.fatigue_low },
    { label: "Fatigue Med ≤", value: config.fatigue_med },
    { label: "Frame Skip", value: `Every ${config.process_every_n_frames}` },
    { label: "Max FPS", value: config.max_fps },
  ];

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="px-4 py-2 border-b border-border flex items-center gap-2">
        <Settings className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Config (Rules)</span>
      </div>
      <div className="grid grid-cols-2 gap-px bg-border">
        {items.map((item) => (
          <div key={item.label} className="bg-card px-3 py-2 flex items-center justify-between">
            <span className="font-mono text-[9px] text-muted-foreground">{item.label}</span>
            <span className="font-mono text-[10px] font-bold text-foreground">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
