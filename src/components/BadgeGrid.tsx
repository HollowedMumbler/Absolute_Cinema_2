import { motion } from 'framer-motion';
import { useGame } from '@/contexts/GameContext';

export function BadgeGrid() {
  const { badges } = useGame();

  return (
    <div className="grid grid-cols-3 gap-4">
      {badges.map((badge, index) => (
        <motion.div
          key={badge.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className={`text-center p-4 rounded-xl ${
            badge.unlocked ? 'badge-unlocked' : 'badge-locked'
          }`}
        >
          <motion.div
            className="text-4xl mb-2"
            animate={badge.unlocked ? { 
              scale: [1, 1.1, 1],
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {badge.icon}
          </motion.div>
          <p className="font-display font-semibold text-xs truncate">{badge.name}</p>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {badge.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
