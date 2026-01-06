import { Bell, Clock, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

interface HeaderProps {
  alertCount?: number;
}

const Header = ({ alertCount = 3 }: HeaderProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-16 border-b border-border/50 bg-card/50 backdrop-blur-xl flex items-center justify-between px-6">
      {/* Left - Status */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 pulse-live" />
          <span className="text-sm font-medium text-foreground">Live Monitoring</span>
        </div>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span className="text-sm">{currentTime.toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Center - Shift Info */}
      <div className="flex items-center gap-4">
        <div className="px-4 py-1.5 rounded-lg bg-muted/50 text-sm">
          <span className="text-muted-foreground">Shift: </span>
          <span className="text-foreground font-medium">Morning (06:00 - 14:00)</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-muted/50 text-sm">
          <Users className="w-4 h-4 text-primary" />
          <span className="text-foreground font-medium">28 Active Workers</span>
        </div>
      </div>

      {/* Right - Notifications */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-lg hover:bg-muted/50 transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
          {alertCount > 0 && (
            <Badge variant="destructive" className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs">
              {alertCount}
            </Badge>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
