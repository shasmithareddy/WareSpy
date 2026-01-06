import { motion } from "framer-motion";
import { ShieldOff, Eye, Users, Lock, Fingerprint, Database } from "lucide-react";

const privacyFeatures = [
  {
    icon: ShieldOff,
    title: "No Facial Recognition",
    description: "We never identify individuals. Workers remain completely anonymous."
  },
  {
    icon: Fingerprint,
    title: "Ephemeral Tracking IDs",
    description: "Session-scoped IDs that expire. No persistent identity database."
  },
  {
    icon: Users,
    title: "Zone-Level Aggregation",
    description: "All insights are aggregated at zone level, not individual level."
  },
  {
    icon: Database,
    title: "Shift-Level Reports",
    description: "Performance summaries at shift level. No individual scoring."
  },
];

const PrivacySection = () => {
  return (
    <section id="privacy" className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background" />
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[150px]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-primary font-semibold tracking-wider uppercase text-sm mb-4 block">
              Privacy by Design
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              WARESPY Sees
              <br />
              <span className="text-gradient">Operations, Not People</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              We built privacy into the foundation. No facial recognition. No identity tracking. 
              Just operational intelligence that respects your workforce.
            </p>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center">
                  <Lock className="w-4 h-4 text-primary" />
                </div>
                <div className="w-10 h-10 rounded-full bg-secondary/40 border-2 border-background flex items-center justify-center">
                  <Eye className="w-4 h-4 text-foreground" />
                </div>
                <div className="w-10 h-10 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                  <ShieldOff className="w-4 h-4 text-foreground" />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                GDPR & Privacy Regulation Ready
              </p>
            </div>

            {/* Quote */}
            <div className="p-6 rounded-2xl bg-muted/30 border border-border/50">
              <p className="text-lg italic text-foreground mb-4">
                "The only system where management sees efficiency and workers see protection. 
                That's the future of ethical workplace AI."
              </p>
              <p className="text-sm text-muted-foreground">
                — Industrial Safety Consultant
              </p>
            </div>
          </motion.div>

          {/* Right Content - Feature Cards */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="grid sm:grid-cols-2 gap-4"
          >
            {privacyFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card rounded-2xl p-6 hover:border-primary/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PrivacySection;
