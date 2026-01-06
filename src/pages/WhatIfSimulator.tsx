import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, TrendingDown, TrendingUp, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { runSimulation, initialZones, type SimulationResult } from "@/lib/warehouseData";

const actions = [
  { id: 'add-worker', label: 'Add Worker', description: 'Simulate adding one worker to the zone' },
  { id: 'reroute-path', label: 'Reroute Path', description: 'Redirect traffic through alternative route' },
  { id: 'reduce-density', label: 'Reduce Density', description: 'Limit max workers in zone' },
  { id: 'add-ppe-checkpoint', label: 'Add PPE Checkpoint', description: 'Install compliance verification point' },
];

const WhatIfSimulator = () => {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [selectedZone, setSelectedZone] = useState<string>('zone-b');
  const [results, setResults] = useState<SimulationResult[] | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulate = () => {
    if (!selectedAction) return;
    setIsSimulating(true);
    setTimeout(() => {
      setResults(runSimulation(selectedAction, selectedZone));
      setIsSimulating(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">What-If Simulator</h1>
        <p className="text-muted-foreground">Test operational changes before implementing them</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Simulation Setup</h2>
          </div>

          {/* Zone Selection */}
          <div className="mb-6">
            <label className="text-sm font-medium text-foreground mb-3 block">Target Zone</label>
            <div className="grid grid-cols-2 gap-2">
              {initialZones.slice(0, 4).map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => setSelectedZone(zone.id)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    selectedZone === zone.id ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
                  }`}
                >
                  <span className="text-sm font-medium text-foreground">{zone.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Action Selection */}
          <div className="mb-6">
            <label className="text-sm font-medium text-foreground mb-3 block">Action to Simulate</label>
            <div className="space-y-2">
              {actions.map((action) => (
                <button
                  key={action.id}
                  onClick={() => setSelectedAction(action.id)}
                  className={`w-full p-4 rounded-lg border text-left transition-all ${
                    selectedAction === action.id ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
                  }`}
                >
                  <span className="font-medium text-foreground">{action.label}</span>
                  <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
                </button>
              ))}
            </div>
          </div>

          <Button variant="hero" size="lg" className="w-full" onClick={handleSimulate} disabled={!selectedAction || isSimulating}>
            {isSimulating ? 'Simulating...' : 'Run Simulation'}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </motion.div>

        {/* Results Panel */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-foreground mb-6">Projected Impact</h2>
          
          {results ? (
            <div className="space-y-4">
              {results.map((result, index) => (
                <motion.div
                  key={result.metric}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg bg-muted/30 border border-border/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">{result.metric}</span>
                    <span className={`flex items-center gap-1 text-sm font-bold ${result.improvement ? 'text-green-400' : 'text-red-400'}`}>
                      {result.improvement ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                      {result.change > 0 ? '+' : ''}{result.change.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">Before: <span className="text-foreground font-medium">{result.before}</span></span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">After: <span className={result.improvement ? 'text-green-400' : 'text-red-400'}>{result.after}</span></span>
                  </div>
                </motion.div>
              ))}
              <div className="mt-6 p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                  <span className="font-medium text-green-400">Simulation Complete</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  This action would improve overall zone performance. Consider implementing during next shift.
                </p>
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center">
              <Sparkles className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Select an action and run simulation to see projected impact</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default WhatIfSimulator;
