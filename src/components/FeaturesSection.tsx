import { motion } from "framer-motion";
import { 
  Users, 
  Map, 
  Flame, 
  ShieldCheck, 
  LayoutDashboard,
  TrendingUp,
  Gauge,
  Battery,
  Sparkles,
  Lock
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Human Detection & Tracking",
    description: "Detect and track workers without identity—ephemeral IDs, movement vectors, raw trajectories.",
    category: "Core"
  },
  {
    icon: Map,
    title: "Zone-Based Mapping",
    description: "Divide warehouse into Loading, Packing, Transit, Restricted zones with activity classification.",
    category: "Core"
  },
  {
    icon: Flame,
    title: "Movement Heatmaps",
    description: "Visualize frequently used paths, highlight bottlenecks, identify unnecessary movement loops.",
    category: "Core"
  },
  {
    icon: ShieldCheck,
    title: "Safety Monitoring",
    description: "PPE detection, restricted zone alerts, unsafe proximity warnings—continuous compliance.",
    category: "Core"
  },
  {
    icon: LayoutDashboard,
    title: "Operational Dashboard",
    description: "Live zone-wise risk levels, active alerts, activity breakdown in one unified view.",
    category: "Core"
  },
  {
    icon: TrendingUp,
    title: "Temporal Intelligence",
    description: "Behavior over time: repeated unsafe posture, chronic idle cycles, congestion trends.",
    category: "Unique"
  },
  {
    icon: Gauge,
    title: "Risk Scoring Engine",
    description: "Live risk score per zone based on PPE, speed, congestion, and posture frequency.",
    category: "Unique"
  },
  {
    icon: Battery,
    title: "Fatigue Detection",
    description: "Infer fatigue from slower movement, increased idle duration, and posture degradation.",
    category: "Unique"
  },
  {
    icon: Sparkles,
    title: "What-If Engine",
    description: "Simulate adding workers, rerouting paths—see projected impact before changes.",
    category: "WOW"
  },
  {
    icon: Lock,
    title: "Privacy-First Layer",
    description: "No facial recognition, no individual IDs. Zone-level and shift-level metrics only.",
    category: "Unique"
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-primary font-semibold tracking-wider uppercase text-sm mb-4 block">
            Capabilities
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Intelligent Features That
            <br />
            <span className="text-gradient">Transform Operations</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From basic detection to predictive intelligence—everything you need
            to optimize safety and efficiency.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`group glass-card rounded-2xl p-8 hover:border-primary/50 transition-all duration-500 ${
                feature.category === "WOW" 
                  ? "lg:col-span-1 border-primary/30 bg-gradient-to-br from-primary/10 to-transparent" 
                  : ""
              }`}
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-all duration-300 ${
                feature.category === "WOW"
                  ? "bg-primary/20 group-hover:bg-primary/30"
                  : feature.category === "Unique"
                  ? "bg-secondary/30 group-hover:bg-secondary/40"
                  : "bg-muted group-hover:bg-muted/80"
              }`}>
                <feature.icon className={`w-7 h-7 ${
                  feature.category === "WOW" ? "text-primary" : "text-foreground"
                }`} />
              </div>

              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
                {feature.category === "WOW" && (
                  <span className="px-2 py-0.5 text-xs font-bold uppercase tracking-wider bg-primary/20 text-primary rounded-full">
                    WOW
                  </span>
                )}
              </div>

              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
