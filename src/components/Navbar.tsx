import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Eye, ChevronDown, HardHat, PersonStanding, Clock, Scan, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const featureItems = [
  { name: "PPE & Safety Compliance", href: "/features/ppe-compliance", icon: HardHat },
  { name: "Unsafe Posture Detection", href: "/features/unsafe-posture", icon: PersonStanding },
  { name: "Fatigue & Temporal Analysis", href: "/features/fatigue-analysis", icon: Clock },
  { name: "Activity Recognition & Idle Detection", href: "/features/activity-recognition", icon: Scan },
  { name: "Movement Analytics & Workflow Insights", href: "/features/movement-analytics", icon: Route },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const navLinks = [
    { name: "How It Works", href: "#how-it-works" },
    { name: "Privacy", href: "#privacy" },
    { name: "Dashboard", href: "#dashboard" },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setFeaturesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/30"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center glow-orange">
              <Eye className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              WARE<span className="text-gradient">SPY</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {/* Features Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setFeaturesOpen(!featuresOpen)}
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors duration-300 text-sm font-medium"
              >
                Features
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${featuresOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {featuresOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 mt-3 w-80 glass-card rounded-xl border border-border/50 shadow-xl overflow-hidden"
                  >
                    <div className="p-2">
                      {featureItems.map((item) => (
                        <button
                          key={item.href}
                          onClick={() => { navigate(item.href); setFeaturesOpen(false); }}
                          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-left hover:bg-muted/50 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <item.icon className="w-4 h-4 text-primary" />
                          </div>
                          <span className="text-sm font-medium text-foreground">{item.name}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors duration-300 text-sm font-medium"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>
              Login
            </Button>
            <Button variant="hero" size="sm" onClick={() => navigate("/demo")}>
              Request Demo
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-foreground"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 pb-4"
            >
              <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 pt-2">Features</p>
                {featureItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => { navigate(item.href); setIsOpen(false); }}
                    className="flex items-center gap-3 px-2 py-2 rounded-lg text-left hover:bg-muted/50 transition-colors"
                  >
                    <item.icon className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">{item.name}</span>
                  </button>
                ))}
                <div className="h-px bg-border/30 my-2" />
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-muted-foreground hover:text-foreground transition-colors py-2 px-2"
                  >
                    {link.name}
                  </a>
                ))}
                <div className="flex flex-col gap-3 pt-4 border-t border-border/30">
                  <Button variant="ghost" className="w-full" onClick={() => { navigate("/auth"); setIsOpen(false); }}>
                    Login
                  </Button>
                  <Button variant="hero" className="w-full" onClick={() => { navigate("/demo"); setIsOpen(false); }}>
                    Request Demo
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
