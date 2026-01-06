import { motion } from "framer-motion";
import { FileText, Download, TrendingUp, Shield, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

const ShiftReports = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Shift Reports</h1>
          <p className="text-muted-foreground">Auto-generated performance summaries</p>
        </div>
        <Button variant="hero"><Download className="w-4 h-4 mr-2" />Export PDF</Button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <FileText className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Morning Shift Summary</h2>
          <span className="text-sm text-muted-foreground ml-auto">06:00 - 14:00</span>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {[
            { icon: Shield, label: 'Safety Score', value: '87%', color: 'text-green-400' },
            { icon: Activity, label: 'Efficiency Score', value: '92%', color: 'text-blue-400' },
            { icon: TrendingUp, label: 'Throughput', value: '+12%', color: 'text-primary' },
          ].map((stat) => (
            <div key={stat.label} className="bg-muted/30 rounded-xl p-4 text-center">
              <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
              <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-foreground mb-2">Top Issues</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-400" />PPE compliance dropped to 78% in Transit Corridor</li>
              <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-orange-400" />Congestion peaked at 85% in Packing Area during 10:00-11:00</li>
              <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-400" />3 unauthorized restricted zone entries detected</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">Recommendations</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Add PPE checkpoint at Transit Corridor entrance</li>
              <li>• Consider staggered break times to reduce Packing Area congestion</li>
              <li>• Review restricted zone access protocols with team leads</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ShiftReports;
