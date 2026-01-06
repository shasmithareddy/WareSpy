import { motion } from "framer-motion";
import { 
  AlertTriangle, 
  CheckCircle2, 
  Activity,
  Users,
  Clock,
  TrendingUp
} from "lucide-react";

const zoneData = [
  { name: "Zone A - Loading", risk: "Low", workers: 8, activity: 76, status: "safe" },
  { name: "Zone B - Packing", risk: "Medium", workers: 12, activity: 89, status: "warning" },
  { name: "Zone C - Transit", risk: "High", workers: 5, activity: 94, status: "alert" },
  { name: "Zone D - Storage", risk: "Low", workers: 3, activity: 42, status: "safe" },
];

const DashboardPreview = () => {
  return (
    <section id="dashboard" className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[150px]" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold tracking-wider uppercase text-sm mb-4 block">
            Live Dashboard
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Real-Time Operational
            <br />
            <span className="text-gradient">Intelligence</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            All insights unified in a single, intuitive interface designed for fast decision-making.
          </p>
        </motion.div>

        {/* Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <div className="glass-card rounded-3xl p-2 glow-orange">
            <div className="bg-background rounded-2xl p-6 md:p-8">
              {/* Dashboard Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 pb-6 border-b border-border/50">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-1">Warehouse Floor Overview</h3>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 pulse-live" />
                    Live • Last updated 2s ago
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="px-4 py-2 rounded-lg bg-muted text-sm">
                    <span className="text-muted-foreground">Shift:</span>{" "}
                    <span className="text-foreground font-medium">Morning (06:00 - 14:00)</span>
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { icon: Users, label: "Active Workers", value: "28", trend: "+3" },
                  { icon: Activity, label: "Avg Activity", value: "78%", trend: "+5%" },
                  { icon: AlertTriangle, label: "Active Alerts", value: "3", trend: "-2" },
                  { icon: Clock, label: "Shift Progress", value: "62%", trend: null },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    className="bg-muted/50 rounded-xl p-4"
                  >
                    <stat.icon className="w-5 h-5 text-muted-foreground mb-3" />
                    <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{stat.label}</span>
                      {stat.trend && (
                        <span className={`text-xs font-medium ${
                          stat.trend.startsWith("+") ? "text-green-400" : "text-red-400"
                        }`}>
                          {stat.trend}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Zone Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                {zoneData.map((zone, index) => (
                  <motion.div
                    key={zone.name}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className={`rounded-xl p-5 border transition-all duration-300 hover:border-primary/30 ${
                      zone.status === "alert" 
                        ? "bg-red-500/10 border-red-500/30" 
                        : zone.status === "warning"
                        ? "bg-yellow-500/10 border-yellow-500/30"
                        : "bg-muted/30 border-border/50"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">{zone.name}</h4>
                        <div className="flex items-center gap-2">
                          {zone.status === "safe" && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                          {zone.status === "warning" && <AlertTriangle className="w-4 h-4 text-yellow-400" />}
                          {zone.status === "alert" && <AlertTriangle className="w-4 h-4 text-red-400" />}
                          <span className={`text-sm font-medium ${
                            zone.status === "safe" ? "text-green-400" :
                            zone.status === "warning" ? "text-yellow-400" : "text-red-400"
                          }`}>
                            {zone.risk} Risk
                          </span>
                        </div>
                      </div>
                      <TrendingUp className={`w-5 h-5 ${
                        zone.status === "alert" ? "text-red-400" : "text-muted-foreground"
                      }`} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-2xl font-bold text-foreground">{zone.workers}</div>
                        <div className="text-xs text-muted-foreground">Workers</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-foreground">{zone.activity}%</div>
                        <div className="text-xs text-muted-foreground">Activity</div>
                      </div>
                    </div>

                    {/* Activity Bar */}
                    <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${zone.activity}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className={`h-full rounded-full ${
                          zone.status === "safe" ? "bg-green-500" :
                          zone.status === "warning" ? "bg-yellow-500" : "bg-red-500"
                        }`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DashboardPreview;
