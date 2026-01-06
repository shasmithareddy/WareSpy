import { type Alert } from "@/lib/warehouseData";
import { 
  ShieldAlert, 
  AlertTriangle, 
  Users, 
  Battery,
  Zap,
  Clock
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface AlertsFeedProps {
  alerts: Alert[];
}

const getAlertIcon = (type: Alert['type']) => {
  switch (type) {
    case 'ppe': return ShieldAlert;
    case 'restricted': return AlertTriangle;
    case 'congestion': return Users;
    case 'fatigue': return Battery;
    case 'proximity': return Zap;
    case 'prediction': return Clock;
  }
};

const getAlertColor = (severity: Alert['severity']) => {
  switch (severity) {
    case 'critical': return 'bg-red-500/20 border-red-500/40 text-red-400';
    case 'high': return 'bg-orange-500/20 border-orange-500/40 text-orange-400';
    case 'medium': return 'bg-yellow-500/20 border-yellow-500/40 text-yellow-400';
    case 'low': return 'bg-blue-500/20 border-blue-500/40 text-blue-400';
  }
};

const AlertsFeed = ({ alerts }: AlertsFeedProps) => {
  if (alerts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground text-sm">No active alerts</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => {
        const Icon = getAlertIcon(alert.type);
        const colorClass = getAlertColor(alert.severity);
        
        return (
          <div
            key={alert.id}
            className={`p-3 rounded-lg border ${colorClass} transition-all duration-200 hover:scale-[1.02] cursor-pointer`}
          >
            <div className="flex items-start gap-3">
              <Icon className="w-4 h-4 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground leading-tight">
                  {alert.message}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs opacity-80">{alert.zone}</span>
                  <span className="text-xs opacity-60">•</span>
                  <span className="text-xs opacity-60">
                    {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
                  </span>
                </div>
              </div>
              <span className={`text-xs font-bold uppercase tracking-wider shrink-0`}>
                {alert.severity}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AlertsFeed;
