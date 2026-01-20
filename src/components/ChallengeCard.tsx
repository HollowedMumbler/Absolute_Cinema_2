import { motion } from 'framer-motion';
import { Clock, Zap, Trophy } from 'lucide-react';
import { Challenge } from '@/contexts/GameContext';

interface ChallengeCardProps {
  challenge: Challenge;
  index: number;
}

export function ChallengeCard({ challenge, index }: ChallengeCardProps) {
  const progress = (challenge.current / challenge.target) * 100;
  const isComplete = challenge.current >= challenge.target;
  
  const typeColors = {
    daily: 'text-primary',
    weekly: 'text-secondary',
    special: 'text-accent',
  };

  const TypeIcon = challenge.type === 'special' ? Trophy : challenge.type === 'daily' ? Clock : Zap;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`racing-card ${isComplete ? 'border-primary/50' : ''}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <TypeIcon className={`w-4 h-4 ${typeColors[challenge.type]}`} />
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            {challenge.type}
          </span>
        </div>
        <div className="stat-badge">
          <Zap className="w-3 h-3 text-accent" />
          <span className="text-accent">+{challenge.reward}</span>
        </div>
      </div>
      
      <h3 className="font-display font-bold text-lg mb-1">{challenge.title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{challenge.description}</p>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-display font-semibold">
            {challenge.current} / {challenge.target}
          </span>
        </div>
        <div className="progress-track">
          <motion.div
            className={`progress-fill ${isComplete ? 'bg-accent' : ''}`}
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
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary font-display font-semibold text-sm">
            <Trophy className="w-4 h-4" />
            Completed!
          </span>
        </motion.div>
      )}
    </motion.div>
  );
}
