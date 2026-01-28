import { motion } from "framer-motion";
import {
  ChevronRight,
  Leaf,
  Route,
  Settings,
  Share2,
  Trophy,
  User,
  Zap,
} from "lucide-react";
import { Link } from "react-router";

import { BadgeGrid } from "@/components/BadgeGrid";
import { MobileNav } from "@/components/MobileNav";
import { ProgressRing } from "@/components/ProgressRing";
import { useGame } from "@/contexts/GameContext";

const Profile = () => {
  const { user, stats, commuteLogs } = useGame();
  const xpProgress = (stats.xp / stats.xpToNextLevel) * 100;

  return (
    <div className="min-h-screen px-4 pt-6 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 rounded-xl p-3">
            <User className="text-primary h-6 w-6" />
          </div>
          <h1 className="font-display text-2xl font-bold">Profile</h1>
        </div>
        <Link to="/settings">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="bg-muted hover:bg-muted/80 rounded-xl p-3 transition-colors"
          >
            <Settings className="text-muted-foreground h-5 w-5" />
          </motion.button>
        </Link>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="racing-card-glow mb-6"
      >
        <div className="flex items-center gap-6">
          <div className="relative">
            <ProgressRing progress={xpProgress} size={100}>
              <div className="bg-card border-primary flex h-16 w-16 items-center justify-center rounded-full border-2 text-3xl">
                {user.avatar}
              </div>
            </ProgressRing>
          </div>
          <div className="flex-1">
            <h2 className="font-display mb-1 text-2xl font-bold">
              {user.name}
            </h2>
            <div className="text-muted-foreground mb-3 flex items-center gap-3 text-sm">
              <span className="stat-badge">
                <Trophy className="text-accent h-3 w-3" />
                Rank #{stats.rank}
              </span>
              <span className="stat-badge">Level {stats.level}</span>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="text-primary flex items-center gap-2 text-sm font-semibold"
            >
              <Share2 className="h-4 w-4" />
              Share Profile
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6 grid grid-cols-2 gap-3"
      >
        <div className="racing-card text-center">
          <Leaf className="text-primary mx-auto mb-2 h-6 w-6" />
          <p className="font-display text-gradient-primary text-2xl font-bold">
            {stats.totalCarbonSaved.toFixed(1)}
          </p>
          <p className="text-muted-foreground text-xs">kg CO₂ Saved</p>
        </div>
        <div className="racing-card text-center">
          <Route className="text-secondary mx-auto mb-2 h-6 w-6" />
          <p className="font-display text-secondary text-2xl font-bold">
            {stats.totalDistance.toFixed(0)}
          </p>
          <p className="text-muted-foreground text-xs">km Traveled</p>
        </div>
        <div className="racing-card text-center">
          <Zap className="text-accent mx-auto mb-2 h-6 w-6" />
          <p className="font-display text-gradient-accent text-2xl font-bold">
            {stats.totalPoints.toLocaleString()}
          </p>
          <p className="text-muted-foreground text-xs">Total Points</p>
        </div>
        <div className="racing-card text-center">
          <Trophy className="text-primary mx-auto mb-2 h-6 w-6" />
          <p className="font-display text-2xl font-bold">
            {stats.totalCommutes}
          </p>
          <p className="text-muted-foreground text-xs">Commutes</p>
        </div>
      </motion.div>

      {/* Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">Badges</h2>
          <button className="text-primary flex items-center gap-1 text-sm">
            View All <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <BadgeGrid />
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="font-display mb-3 text-lg font-bold">Eco Impact</h2>
        <div className="racing-card">
          <div className="space-y-4">
            <div>
              <div className="mb-2 flex justify-between">
                <span className="text-muted-foreground text-sm">
                  Trees Equivalent
                </span>
                <span className="font-display font-semibold">
                  {Math.floor(stats.totalCarbonSaved / 21)} 🌳
                </span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: "65%" }} />
              </div>
            </div>
            <div>
              <div className="mb-2 flex justify-between">
                <span className="text-muted-foreground text-sm">
                  Fuel Saved
                </span>
                <span className="font-display font-semibold">
                  {(stats.totalDistance * 0.08).toFixed(1)}L ⛽
                </span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill bg-secondary"
                  style={{ width: "45%" }}
                />
              </div>
            </div>
            <div>
              <div className="mb-2 flex justify-between">
                <span className="text-muted-foreground text-sm">
                  Money Saved
                </span>
                <span className="font-display font-semibold">
                  ${(stats.totalDistance * 0.15).toFixed(0)} 💰
                </span>
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill bg-accent"
                  style={{ width: "80%" }}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      <MobileNav />
    </div>
  );
};

export default Profile;
