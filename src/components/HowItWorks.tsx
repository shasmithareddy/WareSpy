import { motion } from "framer-motion";
import { Camera, Cpu, LayoutGrid, LineChart, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Camera,
    title: "Video Input",
    description: "Connect existing warehouse CCTV feeds. No new hardware required.",
    color: "from-blue-500/20 to-blue-500/5"
  },
  {
    icon: Cpu,
    title: "AI Processing",
    description: "Real-time detection, tracking, and activity classification at the edge.",
    color: "from-purple-500/20 to-purple-500/5"
  },
  {
    icon: LayoutGrid,
    title: "Zone Analysis",
    description: "Map insights to warehouse zones. Aggregate at zone and shift level.",
    color: "from-primary/20 to-primary/5"
  },
  {
    icon: LineChart,
    title: "Intelligence",
    description: "Risk scores, fatigue detection, predictive alerts, and what-if simulations.",
    color: "from-green-500/20 to-green-500/5"
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

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
            The Process
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            From Video to
            <br />
            <span className="text-gradient">Actionable Intelligence</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Four simple stages transform your existing camera infrastructure into a safety and efficiency powerhouse.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent -translate-y-1/2" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative"
              >
                {/* Step Number */}
                <div className="absolute -top-4 left-0 text-7xl font-bold text-muted/30">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className={`relative glass-card rounded-2xl p-8 h-full bg-gradient-to-b ${step.color} border-t-2 border-t-primary/20`}>
                  <div className="w-14 h-14 rounded-xl bg-background flex items-center justify-center mb-6 shadow-lg">
                    <step.icon className="w-7 h-7 text-primary" />
                  </div>

                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>

                  {/* Arrow for desktop */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-background border border-border items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-primary" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
