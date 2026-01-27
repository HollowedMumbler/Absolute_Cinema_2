import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  unit?: string;
  delay?: number;
  gradient?: boolean;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  unit,
  delay = 0,
  gradient = false,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`racing-card ${gradient ? "racing-card-glow" : ""}`}
    >
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 rounded-lg p-2">
          <Icon className="text-primary h-5 w-5" />
        </div>
        <div>
          <p className="text-muted-foreground text-xs tracking-wider uppercase">
            {label}
          </p>
          <p className="font-display text-xl font-bold">
            {value}
            {unit && (
              <span className="text-muted-foreground ml-1 text-sm">{unit}</span>
            )}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
