import { motion } from "framer-motion";
import { Calendar, Star, Target, Zap } from "lucide-react";

import { ChallengeCard } from "@/components/ChallengeCard";
import { useGame } from "@/contexts/GameContext";

const Challenges = () => {
  const { challenges } = useGame();

  const dailyChallenges = challenges.filter((c) => c.type === "daily");
  const specialChallenges = challenges.filter((c) => c.type === "special");

  return (
    <div className="min-h-screen px-4 pt-6 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center gap-3"
      >
        <div className="bg-primary/10 rounded-xl p-3">
          <Target className="text-primary h-6 w-6" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">Challenges</h1>
          <p className="text-muted-foreground text-sm">
            Complete to earn bonus points
          </p>
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
            <Zap className="text-accent mx-auto mb-1 h-5 w-5" />
            <p className="font-display text-xl font-bold">3</p>
            <p className="text-muted-foreground text-xs">Active</p>
          </div>
          <div>
            <Star className="text-primary mx-auto mb-1 h-5 w-5" />
            <p className="font-display text-xl font-bold">12</p>
            <p className="text-muted-foreground text-xs">Completed</p>
          </div>
          <div>
            <Calendar className="text-secondary mx-auto mb-1 h-5 w-5" />
            <p className="font-display text-xl font-bold">650</p>
            <p className="text-muted-foreground text-xs">Pts Earned</p>
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
          <div className="mb-3 flex items-center gap-2">
            <Star className="text-accent h-5 w-5" />
            <h2 className="font-display neon-accent text-lg font-bold">
              Special Events
            </h2>
          </div>
          <div className="space-y-3">
            {specialChallenges.map((challenge, index) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                index={index}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Daily Challenges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="mb-3 flex items-center gap-2">
          <Calendar className="text-primary h-5 w-5" />
          <h2 className="font-display text-lg font-bold">Daily Challenges</h2>
        </div>
        <div className="space-y-3">
          {dailyChallenges.map((challenge, index) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              index={index}
            />
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
        <p className="text-muted-foreground text-sm">
          New challenges in{" "}
          <span className="text-primary font-display font-semibold">
            12:34:56
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default Challenges;
