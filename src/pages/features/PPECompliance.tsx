import { motion } from "framer-motion";
import { Shield, HardHat, Eye, AlertTriangle, BarChart3, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const tasks = [
  { icon: Eye, title: "Real-Time Detection", desc: "Detect helmets, vests, and gloves in real time using advanced computer vision" },
  { icon: Shield, title: "Person Detection Pipeline", desc: "Build a reliable person detection pipeline as the base layer for all compliance checks" },
  { icon: BarChart3, title: "Compliance Status", desc: "Generate compliance status per frame and per zone for granular safety tracking" },
  { icon: AlertTriangle, title: "Violation Logging", desc: "Log violations and create basic alert triggers for immediate safety response" },
  { icon: Zap, title: "Compliance Summary", desc: "Maintain compliance percentage of workers following PPE rules across shifts" },
];

const tools = ["YOLO / Detectron for detection", "Dataset collection and annotation", "Basic logging and reporting scripts"];

const PPECompliance = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <HardHat className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground">PPE Detection & Safety Compliance</h1>
                <p className="text-muted-foreground mt-1">Person 1 — Real-time protective equipment monitoring</p>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-8 mb-10">
              <h2 className="text-xl font-semibold text-foreground mb-2">Enhanced Outcome</h2>
              <p className="text-muted-foreground leading-relaxed">
                A module that not only detects PPE but also produces <span className="text-primary font-medium">actionable safety metrics</span> — going beyond simple detection to drive compliance improvements across the entire warehouse.
              </p>
            </div>

            <h2 className="text-2xl font-semibold text-foreground mb-6">Key Capabilities</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-10">
              {tasks.map((t, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card rounded-xl p-6 flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <t.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{t.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{t.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <h2 className="text-2xl font-semibold text-foreground mb-4">Tools & Technologies</h2>
            <div className="flex flex-wrap gap-3">
              {tools.map((tool, i) => (
                <span key={i} className="px-4 py-2 rounded-lg bg-muted/50 border border-border/50 text-sm text-muted-foreground">{tool}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default PPECompliance;
