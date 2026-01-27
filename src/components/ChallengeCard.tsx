import { motion } from "framer-motion";
import { Clock, Zap, Trophy } from "lucide-react";
import { type Challenge } from "@/contexts/GameContext";

interface ChallengeCardProps {
  challenge: Challenge;
  index: number;
}

export function ChallengeCard({ challenge, index }: ChallengeCardProps) {
  const progress = (challenge.current / challenge.target) * 100;
  const isComplete = challenge.current >= challenge.target;

  const typeColors = {
    daily: "text-primary",
    weekly: "text-secondary",
    special: "text-accent",
  };

  const TypeIcon =
    challenge.type === "special"
      ? Trophy
      : challenge.type === "daily"
        ? Clock
        : Zap;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`racing-card ${isComplete ? "border-primary/50" : ""}`}
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <TypeIcon className={`h-4 w-4 ${typeColors[challenge.type]}`} />
          <span className="text-muted-foreground text-xs tracking-wider uppercase">
            {challenge.type}
          </span>
        </div>
        <div className="stat-badge">
          <Zap className="text-accent h-3 w-3" />
          <span className="text-accent">+{challenge.reward}</span>
        </div>
      </div>

      <h3 className="font-display mb-1 text-lg font-bold">{challenge.title}</h3>
      <p className="text-muted-foreground mb-4 text-sm">
        {challenge.description}
      </p>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-display font-semibold">
            {challenge.current} / {challenge.target}
          </span>
        </div>
        <div className="progress-track">
          <motion.div
            className={`progress-fill ${isComplete ? "bg-accent" : ""}`}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
          />
        </div>
      </div>

      {isComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 text-center"
        >
          <span className="bg-primary/20 text-primary font-display inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold">
            <Trophy className="h-4 w-4" />
            Completed!
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}
