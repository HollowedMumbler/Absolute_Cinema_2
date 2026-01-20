import { motion } from 'framer-motion';
import { Trophy, Medal, Crown, TrendingUp } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';

const Leaderboard = () => {
  const { leaderboard, user, stats } = useGame();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-400" />;
      case 2: return <Medal className="w-5 h-5 text-gray-400" />;
      case 3: return <Medal className="w-5 h-5 text-amber-600" />;
      default: return <span className="w-5 text-center font-display font-bold text-muted-foreground">{rank}</span>;
    }
  };

  const getRankClass = (rank: number) => {
    switch (rank) {
      case 1: return 'rank-1';
      case 2: return 'rank-2';
      case 3: return 'rank-3';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen pb-24 px-4 pt-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-6"
      >
        <div className="p-3 rounded-xl bg-primary/10">
          <Trophy className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold">Leaderboard</h1>
          <p className="text-muted-foreground text-sm">Global Rankings</p>
        </div>
      </motion.div>

      {/* Your Rank Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="racing-card-glow mb-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-card border-2 border-primary flex items-center justify-center text-3xl animate-pulse-glow">
                {user.avatar}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs font-display font-bold rounded-full w-6 h-6 flex items-center justify-center">
                #{stats.rank}
              </div>
            </div>
            <div>
              <h2 className="font-display font-bold text-xl">{user.name}</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span>Level {stats.level}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="font-display font-bold text-2xl text-gradient-primary">
              {stats.totalPoints.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">points</p>
          </div>
        </div>
      </motion.div>

      {/* Top 3 Podium */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <h2 className="font-display font-bold text-lg mb-4">Top Racers</h2>
        <div className="flex items-end justify-center gap-4 mb-6">
          {/* 2nd Place */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <div className="w-16 h-16 rounded-full bg-card border-2 border-gray-400 flex items-center justify-center text-2xl mx-auto mb-2">
              {leaderboard[1]?.avatar}
            </div>
            <div className="bg-gray-400/20 rounded-t-lg p-3 h-20 flex flex-col justify-end">
              <Medal className="w-5 h-5 text-gray-400 mx-auto mb-1" />
              <p className="text-xs font-display font-semibold truncate max-w-16">
                {leaderboard[1]?.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {leaderboard[1]?.points.toLocaleString()}
              </p>
            </div>
          </motion.div>

          {/* 1st Place */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-center"
          >
            <div className="w-20 h-20 rounded-full bg-card border-2 border-yellow-400 flex items-center justify-center text-3xl mx-auto mb-2 animate-pulse-glow">
              {leaderboard[0]?.avatar}
            </div>
            <div className="bg-yellow-400/20 rounded-t-lg p-3 h-28 flex flex-col justify-end">
              <Crown className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
              <p className="text-sm font-display font-bold truncate max-w-20">
                {leaderboard[0]?.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {leaderboard[0]?.points.toLocaleString()}
              </p>
            </div>
          </motion.div>

          {/* 3rd Place */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-center"
          >
            <div className="w-16 h-16 rounded-full bg-card border-2 border-amber-600 flex items-center justify-center text-2xl mx-auto mb-2">
              {leaderboard[2]?.avatar}
            </div>
            <div className="bg-amber-600/20 rounded-t-lg p-3 h-16 flex flex-col justify-end">
              <Medal className="w-5 h-5 text-amber-600 mx-auto mb-1" />
              <p className="text-xs font-display font-semibold truncate max-w-16">
                {leaderboard[2]?.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {leaderboard[2]?.points.toLocaleString()}
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Full Rankings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="font-display font-bold text-lg mb-3">All Rankings</h2>
        <div className="space-y-2">
          {leaderboard.map((racer, index) => (
            <motion.div
              key={racer.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              className={`leaderboard-row ${getRankClass(racer.rank)} ${
                racer.name === 'You' ? 'border-primary' : ''
              }`}
            >
              <div className="w-8 flex justify-center">
                {getRankIcon(racer.rank)}
              </div>
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xl">
                {racer.avatar}
              </div>
              <div className="flex-1">
                <p className={`font-display font-semibold ${racer.name === 'You' ? 'text-primary' : ''}`}>
                  {racer.name}
                </p>
              </div>
              <p className="font-display font-bold text-muted-foreground">
                {racer.points.toLocaleString()}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Leaderboard;
