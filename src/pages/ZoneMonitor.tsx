import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Map, Activity, Users, AlertTriangle, TrendingUp, Gauge } from "lucide-react";
import { initialZones, generateWorkers, getRiskLevel, type Zone, type Worker } from "@/lib/warehouseData";
import RiskGauge from "@/components/dashboard/RiskGauge";

const ZoneMonitor = () => {
  const [zones, setZones] = useState<Zone[]>(initialZones);
  const [workers, setWorkers] = useState<Worker[]>(generateWorkers(28));
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setZones(prev => prev.map(z => ({
        ...z,
        congestionLevel: Math.max(0, Math.min(100, z.congestionLevel + (Math.random() - 0.5) * 8)),
        riskScore: Math.max(0, Math.min(100, z.riskScore + (Math.random() - 0.5) * 5)),
        avgActivity: Math.max(0, Math.min(100, z.avgActivity + (Math.random() - 0.5) * 6)),
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Get workers in selected zone
  const zoneWorkers = selectedZone 
    ? workers.filter(w => w.zone === selectedZone.id) 
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Zone Monitor</h1>
        <p className="text-muted-foreground">Interactive warehouse zone mapping and activity tracking</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Interactive Zone Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2 glass-card rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Map className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Warehouse Floor Plan</h2>
          </div>

          <div className="relative aspect-[16/10] bg-muted/30 rounded-xl overflow-hidden border border-border/50">
            {/* Grid Pattern */}
            <div className="absolute inset-0 grid-pattern opacity-30" />
            
            {/* Zones */}
            {zones.map((zone) => {
              const risk = getRiskLevel(zone.riskScore);
              const isSelected = selectedZone?.id === zone.id;
              
              return (
                <motion.div
                  key={zone.id}
                  className={`absolute rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                    isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''
                  } ${
                    risk === 'critical' ? "border-red-500 bg-red-500/20" :
                    risk === 'high' ? "border-orange-500 bg-orange-500/20" :
                    risk === 'medium' ? "border-yellow-500 bg-yellow-500/20" :
                    "border-green-500 bg-green-500/10"
                  }`}
                  style={{
                    left: `${zone.x}%`,
                    top: `${zone.y}%`,
                    width: `${zone.width}%`,
                    height: `${zone.height}%`,
                  }}
                  onClick={() => setSelectedZone(zone)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Zone Header */}
                  <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                    <div className="px-2 py-1 rounded bg-background/90 backdrop-blur-sm">
                      <span className="text-xs font-semibold text-foreground">{zone.name}</span>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-bold ${
                      risk === 'critical' ? "bg-red-500 text-white" :
                      risk === 'high' ? "bg-orange-500 text-white" :
                      risk === 'medium' ? "bg-yellow-500 text-black" :
                      "bg-green-500 text-white"
                    }`}>
                      {Math.round(zone.riskScore)}
                    </div>
                  </div>

                  {/* Zone Stats */}
                  <div className="absolute bottom-2 left-2 right-2 flex items-center gap-2">
                    <div className="flex items-center gap-1 px-2 py-1 rounded bg-background/90 backdrop-blur-sm">
                      <Users className="w-3 h-3 text-primary" />
                      <span className="text-xs font-medium text-foreground">{zone.workerCount}</span>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 rounded bg-background/90 backdrop-blur-sm">
                      <Activity className="w-3 h-3 text-green-400" />
                      <span className="text-xs font-medium text-foreground">{Math.round(zone.avgActivity)}%</span>
                    </div>
                  </div>

                  {/* Congestion Warning */}
                  {zone.congestionLevel > 70 && (
                    <motion.div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <AlertTriangle className="w-6 h-6 text-orange-400" />
                    </motion.div>
                  )}
                </motion.div>
              );
            })}

            {/* Legend */}
            <div className="absolute bottom-4 left-4 flex items-center gap-4 px-3 py-2 rounded-lg bg-background/90 backdrop-blur-sm text-xs">
              <span className="font-medium text-foreground">Risk Level:</span>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-green-500" />
                <span className="text-muted-foreground">Low</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-yellow-500" />
                <span className="text-muted-foreground">Medium</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-orange-500" />
                <span className="text-muted-foreground">High</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-red-500" />
                <span className="text-muted-foreground">Critical</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Zone Details Panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card rounded-2xl p-6"
        >
          {selectedZone ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-foreground">{selectedZone.name}</h3>
                <span className={`text-xs font-medium uppercase tracking-wider px-2 py-1 rounded ${
                  selectedZone.type === 'restricted' ? "bg-red-500/20 text-red-400" :
                  selectedZone.type === 'loading' ? "bg-blue-500/20 text-blue-400" :
                  selectedZone.type === 'packing' ? "bg-purple-500/20 text-purple-400" :
                  selectedZone.type === 'transit' ? "bg-orange-500/20 text-orange-400" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {selectedZone.type}
                </span>
              </div>

              {/* Risk Gauge */}
              <RiskGauge score={selectedZone.riskScore} />

              {/* Zone Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/30 rounded-lg p-3">
                  <Users className="w-4 h-4 text-primary mb-2" />
                  <div className="text-2xl font-bold text-foreground">{selectedZone.workerCount}</div>
                  <div className="text-xs text-muted-foreground">Workers</div>
                </div>
                <div className="bg-muted/30 rounded-lg p-3">
                  <Activity className="w-4 h-4 text-green-400 mb-2" />
                  <div className="text-2xl font-bold text-foreground">{Math.round(selectedZone.avgActivity)}%</div>
                  <div className="text-xs text-muted-foreground">Activity</div>
                </div>
                <div className="bg-muted/30 rounded-lg p-3">
                  <TrendingUp className="w-4 h-4 text-yellow-400 mb-2" />
                  <div className="text-2xl font-bold text-foreground">{Math.round(selectedZone.congestionLevel)}%</div>
                  <div className="text-xs text-muted-foreground">Congestion</div>
                </div>
                <div className="bg-muted/30 rounded-lg p-3">
                  <Gauge className="w-4 h-4 text-blue-400 mb-2" />
                  <div className="text-2xl font-bold text-foreground">{selectedZone.ppeCompliance}%</div>
                  <div className="text-xs text-muted-foreground">PPE Compliance</div>
                </div>
              </div>

              {/* Activity Breakdown */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">Worker Activity</h4>
                <div className="space-y-2">
                  {['Moving', 'Idle', 'Carrying'].map((activity, i) => {
                    const percentage = [45, 30, 25][i];
                    return (
                      <div key={activity} className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground w-16">{activity}</span>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${
                              i === 0 ? 'bg-primary' : i === 1 ? 'bg-secondary' : 'bg-green-500'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                        <span className="text-xs font-medium text-foreground w-8">{percentage}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <Map className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Select a Zone</h3>
              <p className="text-sm text-muted-foreground">
                Click on any zone in the map to view detailed analytics and metrics
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ZoneMonitor;
