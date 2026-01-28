import { motion } from "framer-motion";
import { ChevronRight, Flame, Leaf, Route, Trophy, Zap } from "lucide-react";
import { Link, useNavigate } from "react-router";

import { MobileNav } from "@/components/MobileNav";
import { ProgressRing } from "@/components/ProgressRing";
import { StatCard } from "@/components/StatCard";
import { VehicleSelector } from "@/components/VehicleSelector";
import { useGame } from "@/contexts/GameContext";

const Dashboard = () => {
  const { user, stats, challenges } = useGame();
  const navigate = useNavigate();
  const xpProgress = (stats.xp / stats.xpToNextLevel) * 100;

  const activeChallenge = challenges.find((c) => c.current < c.target);

  if (!user) {
    navigate("/sign-in");
  }

  if (user.isNew) {
    navigate("/onboarding");
  }

  return (
    <div className="min-h-screen px-4 pt-6 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center justify-between"
      >
        <div>
          <p className="text-muted-foreground text-sm">Welcome back,</p>
          <h1 className="font-display text-gradient-primary text-2xl font-bold">
            {user.name}
          </h1>
        </div>
        <Link to="/profile" className="relative">
          <motion.div
            whileTap={{ scale: 0.95 }}
            className="bg-card border-primary animate-pulse-glow flex h-14 w-14 items-center justify-center rounded-full border-2 text-2xl"
          >
            {user.avatar}
          </motion.div>
          <div className="bg-primary text-primary-foreground font-display absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold">
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
              <p className="font-display text-gradient-primary text-2xl font-bold">
                {stats.level}
              </p>
              <p className="text-muted-foreground text-xs">Level</p>
            </div>
          </ProgressRing>
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <Trophy className="text-accent h-4 w-4" />
              <span className="text-muted-foreground text-sm">
                Rank #{stats.rank}
              </span>
            </div>
            <p className="font-display mb-1 text-xl font-bold">
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
            <p className="text-muted-foreground mt-1 text-xs">
              {stats.xp} / {stats.xpToNextLevel} XP to next level
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3">
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
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Active Challenge</h2>
            <Link
              to="/challenges"
              className="text-primary flex items-center gap-1 text-sm"
            >
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="racing-card border-l-primary border-l-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-display font-semibold">
                {activeChallenge.title}
              </h3>
              <span className="stat-badge text-accent">
                <Zap className="h-3 w-3" />+{activeChallenge.reward}
              </span>
            </div>
            <p className="text-muted-foreground mb-3 text-sm">
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
            <p className="text-muted-foreground mt-2 text-xs">
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
        <h2 className="font-display mb-3 text-lg font-bold">Your Vehicles</h2>
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
            className="btn-racing w-full text-lg"
          >
            🏁 Start Racing
          </motion.button>
        </Link>
      </motion.div>
      <MobileNav />
    </div>
  );
};

export default Dashboard;
