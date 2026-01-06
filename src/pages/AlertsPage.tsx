import { motion } from "framer-motion";
import { AlertTriangle, ShieldAlert, Users, Battery, Zap, Clock, Check, X } from "lucide-react";
import { useState } from "react";
import { generateAlerts, type Alert } from "@/lib/warehouseData";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

const getAlertIcon = (type: Alert['type']) => {
  const icons = { ppe: ShieldAlert, restricted: AlertTriangle, congestion: Users, fatigue: Battery, proximity: Zap, prediction: Clock };
  return icons[type];
};

const AlertsPage = () => {
  const [alerts, setAlerts] = useState<Alert[]>(generateAlerts());

  const acknowledge = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
  };

  const activeAlerts = alerts.filter(a => !a.acknowledged);
  const resolvedAlerts = alerts.filter(a => a.acknowledged);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Safety Alerts</h1>
        <p className="text-muted-foreground">Real-time safety monitoring and compliance tracking</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Active Alerts */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Active Alerts ({activeAlerts.length})
            </h2>
          </div>
          <div className="space-y-3">
            {activeAlerts.map((alert) => {
              const Icon = getAlertIcon(alert.type);
              return (
                <motion.div key={alert.id} layout className={`p-4 rounded-lg border ${
                  alert.severity === 'critical' ? 'bg-red-500/20 border-red-500/40' :
                  alert.severity === 'high' ? 'bg-orange-500/20 border-orange-500/40' :
                  'bg-yellow-500/20 border-yellow-500/40'
                }`}>
                  <div className="flex items-start gap-3">
                    <Icon className="w-5 h-5 mt-0.5 shrink-0 text-foreground" />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{alert.zone} • {formatDistanceToNow(alert.timestamp, { addSuffix: true })}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => acknowledge(alert.id)}>
                      <Check className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Resolved */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Resolved ({resolvedAlerts.length})</h2>
          <div className="space-y-2">
            {resolvedAlerts.map((alert) => (
              <div key={alert.id} className="p-3 rounded-lg bg-muted/30 border border-border/50 opacity-60">
                <p className="text-sm text-foreground line-through">{alert.message}</p>
                <p className="text-xs text-muted-foreground">{alert.zone}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AlertsPage;
