import { motion } from 'framer-motion';
import { User, Settings, Share2, Leaf, Route, Zap, Trophy, ChevronRight } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';
import { BadgeGrid } from '@/components/BadgeGrid';
import { ProgressRing } from '@/components/ProgressRing';
import { Link } from 'react-router';

const Profile = () => {
  const { user, stats, commuteLogs } = useGame();
  const xpProgress = (stats.xp / stats.xpToNextLevel) * 100;

  return (
    <div className="min-h-screen pb-24 px-4 pt-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10">
            <User className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-display font-bold">Profile</h1>
        </div>
        <Link to="/settings">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
          >
            <Settings className="w-5 h-5 text-muted-foreground" />
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
              <div className="w-16 h-16 rounded-full bg-card border-2 border-primary flex items-center justify-center text-3xl">
                {user.avatar}
              </div>
            </ProgressRing>
          </div>
          <div className="flex-1">
            <h2 className="font-display font-bold text-2xl mb-1">{user.name}</h2>
            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
              <span className="stat-badge">
                <Trophy className="w-3 h-3 text-accent" />
                Rank #{stats.rank}
              </span>
              <span className="stat-badge">
                Level {stats.level}
              </span>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-primary text-sm font-semibold"
            >
              <Share2 className="w-4 h-4" />
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
        className="grid grid-cols-2 gap-3 mb-6"
      >
        <div className="racing-card text-center">
          <Leaf className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="font-display font-bold text-2xl text-gradient-primary">
            {stats.totalCarbonSaved.toFixed(1)}
          </p>
          <p className="text-xs text-muted-foreground">kg CO₂ Saved</p>
        </div>
        <div className="racing-card text-center">
          <Route className="w-6 h-6 text-secondary mx-auto mb-2" />
          <p className="font-display font-bold text-2xl text-secondary">
            {stats.totalDistance.toFixed(0)}
          </p>
          <p className="text-xs text-muted-foreground">km Traveled</p>
        </div>
        <div className="racing-card text-center">
          <Zap className="w-6 h-6 text-accent mx-auto mb-2" />
          <p className="font-display font-bold text-2xl text-gradient-accent">
            {stats.totalPoints.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">Total Points</p>
        </div>
        <div className="racing-card text-center">
          <Trophy className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="font-display font-bold text-2xl">
            {stats.totalCommutes}
          </p>
          <p className="text-xs text-muted-foreground">Commutes</p>
        </div>
      </motion.div>

      {/* Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-bold text-lg">Badges</h2>
          <button className="text-primary text-sm flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
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
        <h2 className="font-display font-bold text-lg mb-3">Eco Impact</h2>
        <div className="racing-card">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Trees Equivalent</span>
                <span className="font-display font-semibold">
                  {Math.floor(stats.totalCarbonSaved / 21)} 🌳
                </span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: '65%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Fuel Saved</span>
                <span className="font-display font-semibold">
                  {(stats.totalDistance * 0.08).toFixed(1)}L ⛽
                </span>
              </div>
              <div className="progress-track">
                <div className="progress-fill bg-secondary" style={{ width: '45%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Money Saved</span>
                <span className="font-display font-semibold">
                  ${(stats.totalDistance * 0.15).toFixed(0)} 💰
                </span>
              </div>
              <div className="progress-track">
                <div className="progress-fill bg-accent" style={{ width: '80%' }} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;