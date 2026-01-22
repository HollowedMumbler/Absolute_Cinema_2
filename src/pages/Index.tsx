import { motion } from "framer-motion";
import { Zap, Leaf, Route, Flame, Trophy, ChevronRight } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { StatCard } from "@/components/StatCard";
import { ProgressRing } from "@/components/ProgressRing";
import { VehicleSelector } from "@/components/VehicleSelector";
import { Link } from "react-router";

const Index = () => {
  const { user, stats, challenges } = useGame();
  const xpProgress = (stats.xp / stats.xpToNextLevel) * 100;

  const activeChallenge = challenges.find((c) => c.current < c.target);

  return (
    <div className="min-h-screen pb-24 px-4 pt-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <p className="text-muted-foreground text-sm">Welcome back,</p>
          <h1 className="text-2xl font-display font-bold text-gradient-primary">
            {user.name}
          </h1>
        </div>
        <Link to="/profile" className="relative">
          <motion.div
            whileTap={{ scale: 0.95 }}
            className="w-14 h-14 rounded-full bg-card border-2 border-primary flex items-center justify-center text-2xl animate-pulse-glow"
          >
            {user.avatar}
          </motion.div>
          <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs font-display font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {stats.level}
          </div>
        </Link>
      </motion.div>

      {/* Level Progress */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="racing-card-glow mb-6"
      >
        <div className="flex items-center gap-6">
          <ProgressRing progress={xpProgress} size={100}>
            <div className="text-center">
              <p className="font-display font-bold text-2xl text-gradient-primary">
                {stats.level}
              </p>
              <p className="text-xs text-muted-foreground">Level</p>
            </div>
          </ProgressRing>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-4 h-4 text-accent" />
              <span className="text-sm text-muted-foreground">
                Rank #{stats.rank}
              </span>
            </div>
            <p className="font-display font-bold text-xl mb-1">
              {stats.totalPoints.toLocaleString()}{" "}
              <span className="text-primary">PTS</span>
            </p>
            <div className="progress-track h-2">
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.xp} / {stats.xpToNextLevel} XP to next level
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <StatCard
          icon={Leaf}
          label="CO₂ Saved"
          value={stats.totalCarbonSaved.toFixed(1)}
          unit="kg"
          delay={0.2}
        />
        <StatCard
          icon={Route}
          label="Distance"
          value={stats.totalDistance.toFixed(1)}
          unit="km"
          delay={0.25}
        />
        <StatCard
          icon={Flame}
          label="Streak"
          value={stats.currentStreak}
          unit="days"
          delay={0.3}
        />
        <StatCard
          icon={Zap}
          label="Best Lap"
          value={stats.bestLapTime.toFixed(1)}
          unit="s"
          delay={0.35}
          gradient
        />
      </div>

      {/* Active Challenge */}
      {activeChallenge && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-lg">Active Challenge</h2>
            <Link
              to="/challenges"
              className="text-primary text-sm flex items-center gap-1"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="racing-card border-l-4 border-l-primary">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-display font-semibold">
                {activeChallenge.title}
              </h3>
              <span className="stat-badge text-accent">
                <Zap className="w-3 h-3" />+{activeChallenge.reward}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              {activeChallenge.description}
            </p>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${(activeChallenge.current / activeChallenge.target) * 100}%`,
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {activeChallenge.current} / {activeChallenge.target}
            </p>
          </div>
        </motion.div>
      )}

      {/* Vehicle Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="font-display font-bold text-lg mb-3">Your Vehicles</h2>
        <VehicleSelector />
      </motion.div>

      {/* Quick Race Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-6"
      >
        <Link to="/race">
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="w-full btn-racing text-lg"
          >
            🏁 Start Racing
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
};

export default Index;
