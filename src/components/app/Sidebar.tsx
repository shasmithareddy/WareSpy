import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Map, 
  Flame, 
  AlertTriangle, 
  Sparkles, 
  FileText,
  Eye,
  Settings,
  Shield
} from "lucide-react";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/zones", icon: Map, label: "Zone Monitor" },
  { to: "/heatmap", icon: Flame, label: "Heatmaps" },
  { to: "/alerts", icon: AlertTriangle, label: "Safety Alerts" },
  { to: "/simulator", icon: Sparkles, label: "What-If Engine" },
  { to: "/reports", icon: FileText, label: "Shift Reports" },
];

const AppSidebar = () => {
  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border/50 flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-border/50">
        <a href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center glow-orange">
            <Eye className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight">
              WARE<span className="text-gradient">SPY</span>
            </span>
            <p className="text-xs text-muted-foreground">Intelligence System</p>
          </div>
        </a>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Privacy Badge */}
      <div className="p-4 border-t border-border/50">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/30">
          <Shield className="w-5 h-5 text-primary" />
          <div>
            <p className="text-xs font-medium text-foreground">Privacy Mode</p>
            <p className="text-xs text-muted-foreground">No identity tracking</p>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="p-4">
        <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 w-full">
          <Settings className="w-5 h-5" />
          Settings
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
