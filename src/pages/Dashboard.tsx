import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Activity, 
  AlertTriangle, 
  Clock, 
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Flame,
  Battery,
  Gauge
} from "lucide-react";
import { 
  initialZones, 
  generateWorkers, 
  generateAlerts,
  getRiskLevel,
  type Zone,
  type Worker,
  type Alert
} from "@/lib/warehouseData";
import LiveZoneMap from "@/components/dashboard/LiveZoneMap";
import AlertsFeed from "@/components/dashboard/AlertsFeed";
import RiskGauge from "@/components/dashboard/RiskGauge";

const Dashboard = () => {
  const [zones, setZones] = useState<Zone[]>(initialZones);
  const [workers, setWorkers] = useState<Worker[]>(generateWorkers(28));
  const [alerts, setAlerts] = useState<Alert[]>(generateAlerts());

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update worker positions slightly
      setWorkers(prev => prev.map(w => ({
        ...w,
        x: Math.max(0, Math.min(100, w.x + (Math.random() - 0.5) * 2)),
        y: Math.max(0, Math.min(100, w.y + (Math.random() - 0.5) * 2)),
        speed: Math.max(1, Math.min(6, w.speed + (Math.random() - 0.5))),
        fatigueLevel: Math.min(100, w.fatigueLevel + Math.random() * 0.5),
      })));

      // Update zone metrics slightly
      setZones(prev => prev.map(z => ({
        ...z,
        congestionLevel: Math.max(0, Math.min(100, z.congestionLevel + (Math.random() - 0.5) * 5)),
        riskScore: Math.max(0, Math.min(100, z.riskScore + (Math.random() - 0.5) * 3)),
        avgActivity: Math.max(0, Math.min(100, z.avgActivity + (Math.random() - 0.5) * 4)),
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const totalWorkers = workers.length;
  const avgActivity = Math.round(zones.reduce((acc, z) => acc + z.avgActivity, 0) / zones.length);
  const activeAlerts = alerts.filter(a => !a.acknowledged).length;
  const overallRisk = Math.round(zones.reduce((acc, z) => acc + z.riskScore, 0) / zones.length);
  const ppeCompliance = Math.round(workers.filter(w => w.hasPPE).length / workers.length * 100);
  const avgFatigue = Math.round(workers.reduce((acc, w) => acc + w.fatigueLevel, 0) / workers.length);

  const stats = [
    { icon: Users, label: "Active Workers", value: totalWorkers, trend: "+3", trendUp: true, color: "text-primary" },
    { icon: Activity, label: "Avg Activity", value: `${avgActivity}%`, trend: "+5%", trendUp: true, color: "text-green-400" },
    { icon: AlertTriangle, label: "Active Alerts", value: activeAlerts, trend: "-2", trendUp: false, color: "text-red-400" },
    { icon: ShieldCheck, label: "PPE Compliance", value: `${ppeCompliance}%`, trend: "+2%", trendUp: true, color: "text-blue-400" },
    { icon: Battery, label: "Avg Fatigue", value: `${avgFatigue}%`, trend: "+8%", trendUp: false, color: "text-yellow-400" },
    { icon: Clock, label: "Shift Progress", value: "62%", trend: null, trendUp: null, color: "text-muted-foreground" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Operations Dashboard</h1>
          <p className="text-muted-foreground">Real-time warehouse intelligence overview</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20">
          <span className="w-2 h-2 rounded-full bg-green-500 pulse-live" />
          <span className="text-sm font-medium text-green-400">All Systems Operational</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="glass-card rounded-xl p-4"
          >
            <stat.icon className={`w-5 h-5 ${stat.color} mb-3`} />
            <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{stat.label}</span>
              {stat.trend && (
                <span className={`text-xs font-medium flex items-center gap-0.5 ${
                  stat.trendUp ? "text-green-400" : "text-red-400"
                }`}>
                  {stat.trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {stat.trend}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Live Zone Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2 glass-card rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Live Zone Monitor</h2>
              <p className="text-sm text-muted-foreground">Real-time worker tracking & zone activity</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-muted-foreground">Moving</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-secondary" />
                <span className="text-muted-foreground">Idle</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-muted-foreground">Carrying</span>
              </div>
            </div>
          </div>
          <LiveZoneMap zones={zones} workers={workers} />
        </motion.div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Overall Risk Gauge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Gauge className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-foreground">Overall Risk Score</h3>
            </div>
            <RiskGauge score={overallRisk} />
          </motion.div>

          {/* Alerts Feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <h3 className="font-semibold text-foreground">Active Alerts</h3>
              </div>
              <span className="text-xs text-muted-foreground">{activeAlerts} unresolved</span>
            </div>
            <AlertsFeed alerts={alerts.filter(a => !a.acknowledged).slice(0, 4)} />
          </motion.div>
        </div>
      </div>

      {/* Zone Details Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h2 className="text-xl font-semibold text-foreground mb-4">Zone Performance</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {zones.map((zone) => {
            const risk = getRiskLevel(zone.riskScore);
            return (
              <div
                key={zone.id}
                className={`rounded-xl p-5 border transition-all duration-300 hover:border-primary/30 ${
                  risk === 'critical' ? "bg-red-500/10 border-red-500/30" :
                  risk === 'high' ? "bg-orange-500/10 border-orange-500/30" :
                  risk === 'medium' ? "bg-yellow-500/10 border-yellow-500/30" :
                  "bg-muted/30 border-border/50"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-foreground">{zone.name}</h4>
                    <span className={`text-xs font-medium uppercase tracking-wider ${
                      risk === 'critical' ? "text-red-400" :
                      risk === 'high' ? "text-orange-400" :
                      risk === 'medium' ? "text-yellow-400" :
                      "text-green-400"
                    }`}>
                      {risk} risk
                    </span>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    zone.type === 'restricted' ? "bg-red-500/20 text-red-400" :
                    zone.type === 'loading' ? "bg-blue-500/20 text-blue-400" :
                    zone.type === 'packing' ? "bg-purple-500/20 text-purple-400" :
                    zone.type === 'transit' ? "bg-orange-500/20 text-orange-400" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {zone.type}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div>
                    <div className="text-lg font-bold text-foreground">{zone.workerCount}</div>
                    <div className="text-xs text-muted-foreground">Workers</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-foreground">{Math.round(zone.congestionLevel)}%</div>
                    <div className="text-xs text-muted-foreground">Congestion</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-foreground">{zone.ppeCompliance}%</div>
                    <div className="text-xs text-muted-foreground">PPE</div>
                  </div>
                </div>

                {/* Risk Bar */}
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${zone.riskScore}%` }}
                    transition={{ duration: 1 }}
                    className={`h-full rounded-full ${
                      risk === 'critical' ? "bg-red-500" :
                      risk === 'high' ? "bg-orange-500" :
                      risk === 'medium' ? "bg-yellow-500" :
                      "bg-green-500"
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
