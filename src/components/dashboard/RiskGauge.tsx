import { motion } from "framer-motion";
import { getRiskLevel } from "@/lib/warehouseData";

interface RiskGaugeProps {
  score: number;
}

const RiskGauge = ({ score }: RiskGaugeProps) => {
  const risk = getRiskLevel(score);
  const rotation = (score / 100) * 180 - 90; // -90 to 90 degrees
  
  const riskColors = {
    low: { bg: 'from-green-500 to-green-400', text: 'text-green-400', label: 'LOW' },
    medium: { bg: 'from-yellow-500 to-yellow-400', text: 'text-yellow-400', label: 'MEDIUM' },
    high: { bg: 'from-orange-500 to-orange-400', text: 'text-orange-400', label: 'HIGH' },
    critical: { bg: 'from-red-500 to-red-400', text: 'text-red-400', label: 'CRITICAL' },
  };

  const current = riskColors[risk];

  return (
    <div className="flex flex-col items-center">
      {/* Gauge */}
      <div className="relative w-48 h-24 overflow-hidden">
        {/* Background arc */}
        <div className="absolute bottom-0 left-0 right-0 h-24">
          <svg viewBox="0 0 200 100" className="w-full h-full">
            {/* Background arc */}
            <path
              d="M 10 100 A 90 90 0 0 1 190 100"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="16"
              strokeLinecap="round"
            />
            {/* Colored sections */}
            <path
              d="M 10 100 A 90 90 0 0 1 55 25"
              fill="none"
              stroke="hsl(142 76% 36%)"
              strokeWidth="16"
              strokeLinecap="round"
              opacity="0.3"
            />
            <path
              d="M 55 25 A 90 90 0 0 1 100 10"
              fill="none"
              stroke="hsl(48 96% 53%)"
              strokeWidth="16"
              opacity="0.3"
            />
            <path
              d="M 100 10 A 90 90 0 0 1 145 25"
              fill="none"
              stroke="hsl(25 95% 53%)"
              strokeWidth="16"
              opacity="0.3"
            />
            <path
              d="M 145 25 A 90 90 0 0 1 190 100"
              fill="none"
              stroke="hsl(0 84% 60%)"
              strokeWidth="16"
              strokeLinecap="round"
              opacity="0.3"
            />
          </svg>
        </div>

        {/* Needle */}
        <motion.div
          className="absolute bottom-0 left-1/2 origin-bottom"
          initial={{ rotate: -90 }}
          animate={{ rotate: rotation }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ transformOrigin: 'bottom center' }}
        >
          <div className={`w-1 h-20 bg-gradient-to-t ${current.bg} rounded-full shadow-lg`} />
        </motion.div>

        {/* Center circle */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-6 h-6 rounded-full bg-background border-2 border-border" />
      </div>

      {/* Score display */}
      <div className="mt-4 text-center">
        <motion.div
          className={`text-4xl font-bold ${current.text}`}
          key={score}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {Math.round(score)}
        </motion.div>
        <div className={`text-sm font-bold tracking-wider ${current.text}`}>
          {current.label} RISK
        </div>
      </div>

      {/* Scale labels */}
      <div className="flex justify-between w-full mt-4 px-2 text-xs text-muted-foreground">
        <span>0</span>
        <span>25</span>
        <span>50</span>
        <span>75</span>
        <span>100</span>
      </div>
    </div>
  );
};

export default RiskGauge;
