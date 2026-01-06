import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Flame, Activity, AlertTriangle, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateHeatmap, initialZones, type HeatmapPoint, type Zone } from "@/lib/warehouseData";

const HeatmapPage = () => {
  const [heatmapData, setHeatmapData] = useState<HeatmapPoint[]>(generateHeatmap());
  const [showZones, setShowZones] = useState(true);
  const [showCongestion, setShowCongestion] = useState(true);
  const [timeRange, setTimeRange] = useState<'1h' | '4h' | '8h' | 'shift'>('4h');

  // Simulate heatmap updates
  useEffect(() => {
    const interval = setInterval(() => {
      setHeatmapData(prev => prev.map(p => ({
        ...p,
        intensity: Math.max(0.1, Math.min(1, p.intensity + (Math.random() - 0.5) * 0.1))
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getHeatColor = (intensity: number) => {
    if (intensity > 0.8) return 'rgba(239, 68, 68, 0.7)'; // red
    if (intensity > 0.6) return 'rgba(249, 115, 22, 0.6)'; // orange  
    if (intensity > 0.4) return 'rgba(234, 179, 8, 0.5)'; // yellow
    if (intensity > 0.2) return 'rgba(34, 197, 94, 0.4)'; // green
    return 'rgba(59, 130, 246, 0.3)'; // blue
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Movement Heatmaps</h1>
          <p className="text-muted-foreground">Visualize traffic patterns and identify bottlenecks</p>
        </div>
        <div className="flex items-center gap-3">
          {(['1h', '4h', '8h', 'shift'] as const).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range)}
            >
              {range === 'shift' ? 'Full Shift' : range}
            </Button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <Button
          variant={showZones ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowZones(!showZones)}
        >
          {showZones ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
          Zone Boundaries
        </Button>
        <Button
          variant={showCongestion ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowCongestion(!showCongestion)}
        >
          <AlertTriangle className="w-4 h-4 mr-2" />
          Congestion Alerts
        </Button>
      </div>

      {/* Main Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card rounded-2xl p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Flame className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Traffic Density Map</h2>
          <span className="ml-auto text-sm text-muted-foreground">Last 4 hours</span>
        </div>

        <div className="relative aspect-[16/10] bg-muted/30 rounded-xl overflow-hidden border border-border/50">
          {/* Grid Pattern */}
          <div className="absolute inset-0 grid-pattern opacity-20" />

          {/* Zones (optional) */}
          {showZones && initialZones.map((zone) => (
            <div
              key={zone.id}
              className="absolute border-2 border-foreground/20 rounded-lg"
              style={{
                left: `${zone.x}%`,
                top: `${zone.y}%`,
                width: `${zone.width}%`,
                height: `${zone.height}%`,
              }}
            >
              <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-background/80 backdrop-blur-sm">
                <span className="text-xs text-foreground">{zone.name}</span>
              </div>
            </div>
          ))}

          {/* Heatmap points */}
          {heatmapData.map((point, index) => (
            <motion.div
              key={index}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: `${point.x}%`,
                top: `${point.y}%`,
                width: `${8 + point.intensity * 20}px`,
                height: `${8 + point.intensity * 20}px`,
                backgroundColor: getHeatColor(point.intensity),
                transform: 'translate(-50%, -50%)',
                filter: 'blur(8px)',
              }}
              animate={{
                opacity: [0.6, 0.9, 0.6],
              }}
              transition={{ duration: 2, repeat: Infinity, delay: index * 0.01 }}
            />
          ))}

          {/* Congestion Alerts */}
          {showCongestion && (
            <>
              <motion.div
                className="absolute top-[15%] left-[35%] px-3 py-1.5 rounded-lg bg-red-500/90 shadow-lg"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <span className="text-xs font-bold text-white">BOTTLENECK</span>
              </motion.div>
              <motion.div
                className="absolute top-[12%] left-[75%] px-3 py-1.5 rounded-lg bg-orange-500/90 shadow-lg"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                <span className="text-xs font-bold text-white">HIGH TRAFFIC</span>
              </motion.div>
            </>
          )}

          {/* Flow Arrows */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-50">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--primary))" />
              </marker>
            </defs>
            {/* Main flow paths */}
            <motion.path
              d="M 15 30 Q 30 30 40 25 Q 55 18 75 20"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              strokeDasharray="5,5"
              markerEnd="url(#arrowhead)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, delay: 0.5 }}
            />
            <motion.path
              d="M 25 60 Q 40 50 55 85"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              strokeDasharray="5,5"
              markerEnd="url(#arrowhead)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2, delay: 1 }}
            />
          </svg>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 flex items-center gap-4 px-4 py-2 rounded-lg bg-background/90 backdrop-blur-sm">
            <span className="text-xs font-medium text-foreground">Traffic Density:</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(59, 130, 246, 0.5)' }} />
              <span className="text-xs text-muted-foreground">Low</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(234, 179, 8, 0.6)' }} />
              <span className="text-xs text-muted-foreground">Medium</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgba(239, 68, 68, 0.7)' }} />
              <span className="text-xs text-muted-foreground">High</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Insights Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card rounded-xl p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <h3 className="font-semibold text-foreground">Bottlenecks Detected</h3>
          </div>
          <div className="text-3xl font-bold text-red-400 mb-2">3</div>
          <p className="text-sm text-muted-foreground">
            Primary bottleneck at Packing→Transit junction causing 23% delays
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass-card rounded-xl p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-5 h-5 text-yellow-400" />
            <h3 className="font-semibold text-foreground">Unnecessary Loops</h3>
          </div>
          <div className="text-3xl font-bold text-yellow-400 mb-2">7</div>
          <p className="text-sm text-muted-foreground">
            Workers making redundant trips between Storage and Packing areas
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass-card rounded-xl p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <Flame className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Peak Traffic Time</h3>
          </div>
          <div className="text-3xl font-bold text-primary mb-2">10:30 AM</div>
          <p className="text-sm text-muted-foreground">
            Congestion peaks during mid-morning shift handover period
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default HeatmapPage;
