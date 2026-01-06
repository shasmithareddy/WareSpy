import { motion } from "framer-motion";
import { type Zone, type Worker, getRiskLevel, getActivityColor } from "@/lib/warehouseData";

interface LiveZoneMapProps {
  zones: Zone[];
  workers: Worker[];
}

const LiveZoneMap = ({ zones, workers }: LiveZoneMapProps) => {
  return (
    <div className="relative aspect-[16/10] bg-muted/30 rounded-xl overflow-hidden border border-border/50">
      {/* Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      
      {/* Zones */}
      {zones.map((zone) => {
        const risk = getRiskLevel(zone.riskScore);
        return (
          <motion.div
            key={zone.id}
            className={`absolute rounded-lg border-2 transition-all duration-500 ${
              risk === 'critical' ? "border-red-500/60 bg-red-500/10" :
              risk === 'high' ? "border-orange-500/60 bg-orange-500/10" :
              risk === 'medium' ? "border-yellow-500/60 bg-yellow-500/10" :
              "border-green-500/40 bg-green-500/5"
            }`}
            style={{
              left: `${zone.x}%`,
              top: `${zone.y}%`,
              width: `${zone.width}%`,
              height: `${zone.height}%`,
            }}
            whileHover={{ scale: 1.02 }}
          >
            {/* Zone Label */}
            <div className="absolute top-2 left-2 px-2 py-1 rounded bg-background/80 backdrop-blur-sm">
              <span className="text-xs font-medium text-foreground">{zone.name}</span>
            </div>
            
            {/* Zone Stats */}
            <div className="absolute bottom-2 right-2 flex items-center gap-2">
              <div className="px-2 py-1 rounded bg-background/80 backdrop-blur-sm">
                <span className="text-xs text-muted-foreground">{zone.workerCount} workers</span>
              </div>
              {zone.type === 'restricted' && (
                <div className="px-2 py-1 rounded bg-red-500/20">
                  <span className="text-xs font-bold text-red-400">RESTRICTED</span>
                </div>
              )}
            </div>

            {/* Congestion Indicator */}
            {zone.congestionLevel > 70 && (
              <motion.div
                className="absolute top-2 right-2"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <div className="px-2 py-1 rounded bg-orange-500/20">
                  <span className="text-xs font-bold text-orange-400">CONGESTED</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        );
      })}

      {/* Workers as dots */}
      {workers.map((worker) => (
        <motion.div
          key={worker.id}
          className="absolute z-10"
          style={{
            left: `${worker.x}%`,
            top: `${worker.y}%`,
          }}
          animate={{
            left: `${worker.x}%`,
            top: `${worker.y}%`,
          }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          <div className="relative -translate-x-1/2 -translate-y-1/2">
            {/* Worker dot */}
            <motion.div
              className={`w-3 h-3 rounded-full ${
                worker.activity === 'moving' ? 'bg-primary' :
                worker.activity === 'idle' ? 'bg-secondary' :
                'bg-green-500'
              }`}
              animate={worker.activity === 'moving' ? {
                scale: [1, 1.2, 1],
              } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            />
            
            {/* PPE Warning */}
            {!worker.hasPPE && (
              <motion.div
                className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            )}
            
            {/* Fatigue Indicator */}
            {worker.fatigueLevel > 70 && (
              <motion.div
                className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full bg-yellow-500"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </div>
        </motion.div>
      ))}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex items-center gap-4 px-3 py-2 rounded-lg bg-background/80 backdrop-blur-sm text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-muted-foreground">No PPE</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-yellow-500" />
          <span className="text-muted-foreground">Fatigued</span>
        </div>
      </div>
    </div>
  );
};

export default LiveZoneMap;
