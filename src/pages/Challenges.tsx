import { motion } from 'framer-motion';
import { Target, Zap, Calendar, Star } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';
import { ChallengeCard } from '@/components/ChallengeCard';

const Challenges = () => {
  const { challenges } = useGame();
  
  const dailyChallenges = challenges.filter(c => c.type === 'daily');
  const specialChallenges = challenges.filter(c => c.type === 'special');

  return (
    <div className="min-h-screen pb-24 px-4 pt-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-6"
      >
        <div className="p-3 rounded-xl bg-primary/10">
          <Target className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold">Challenges</h1>
          <p className="text-muted-foreground text-sm">Complete to earn bonus points</p>
        </div>
      </motion.div>

      {/* Stats Summary */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="racing-card-glow mb-6"
      >
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <Zap className="w-5 h-5 text-accent mx-auto mb-1" />
            <p className="font-display font-bold text-xl">3</p>
            <p className="text-xs text-muted-foreground">Active</p>
          </div>
          <div>
            <Star className="w-5 h-5 text-primary mx-auto mb-1" />
            <p className="font-display font-bold text-xl">12</p>
            <p className="text-xs text-muted-foreground">Completed</p>
          </div>
          <div>
            <Calendar className="w-5 h-5 text-secondary mx-auto mb-1" />
            <p className="font-display font-bold text-xl">650</p>
            <p className="text-xs text-muted-foreground">Pts Earned</p>
          </div>
        </div>
      </motion.div>

      {/* Special Event */}
      {specialChallenges.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-5 h-5 text-accent" />
            <h2 className="font-display font-bold text-lg neon-accent">Special Events</h2>
          </div>
          <div className="space-y-3">
            {specialChallenges.map((challenge, index) => (
              <ChallengeCard key={challenge.id} challenge={challenge} index={index} />
            ))}
          </div>
        </motion.div>
      )}
gi
      {/* Daily Challenges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-5 h-5 text-primary" />
          <h2 className="font-display font-bold text-lg">Daily Challenges</h2>
        </div>
        <div className="space-y-3">
          {dailyChallenges.map((challenge, index) => (
            <ChallengeCard key={challenge.id} challenge={challenge} index={index} />
          ))}
        </div>
      </motion.div>

      {/* Refresh Timer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 text-center"
      >
        <p className="text-sm text-muted-foreground">
          New challenges in <span className="text-primary font-display font-semibold">12:34:56</span>
        </p>
      </motion.div>
    </div>
  );
};

export default Challenges;
