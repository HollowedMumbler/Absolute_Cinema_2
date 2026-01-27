import { motion } from "framer-motion";
import { Trophy, Medal, Crown, TrendingUp } from "lucide-react";
import { useGame } from "@/contexts/GameContext";

const Leaderboard = () => {
  const { leaderboard, user, stats } = useGame();

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-400" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />;
      default:
        return (
          <span className="font-display text-muted-foreground w-5 text-center font-bold">
            {rank}
          </span>
        );
    }
  };

  const getRankClass = (rank: number) => {
    switch (rank) {
      case 1:
        return "rank-1";
      case 2:
        return "rank-2";
      case 3:
        return "rank-3";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen px-4 pt-6 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center gap-3"
      >
        <div className="bg-primary/10 rounded-xl p-3">
          <Trophy className="text-primary h-6 w-6" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">Leaderboard</h1>
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
              <div className="bg-card border-primary animate-pulse-glow flex h-16 w-16 items-center justify-center rounded-full border-2 text-3xl">
                {user.avatar}
              </div>
              <div className="bg-primary text-primary-foreground font-display absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold">
                #{stats.rank}
              </div>
            </div>
            <div>
              <h2 className="font-display text-xl font-bold">{user.name}</h2>
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <TrendingUp className="text-primary h-4 w-4" />
                <span>Level {stats.level}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="font-display text-gradient-primary text-2xl font-bold">
              {stats.totalPoints.toLocaleString()}
            </p>
            <p className="text-muted-foreground text-xs">points</p>
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
        <h2 className="font-display mb-4 text-lg font-bold">Top Racers</h2>
        <div className="mb-6 flex items-end justify-center gap-4">
          {/* 2nd Place */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <div className="bg-card mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full border-2 border-gray-400 text-2xl">
              {leaderboard[1]?.avatar}
            </div>
            <div className="flex h-20 flex-col justify-end rounded-t-lg bg-gray-400/20 p-3">
              <Medal className="mx-auto mb-1 h-5 w-5 text-gray-400" />
              <p className="font-display max-w-16 truncate text-xs font-semibold">
                {leaderboard[1]?.name}
              </p>
              <p className="text-muted-foreground text-xs">
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
            <div className="bg-card animate-pulse-glow mx-auto mb-2 flex h-20 w-20 items-center justify-center rounded-full border-2 border-yellow-400 text-3xl">
              {leaderboard[0]?.avatar}
            </div>
            <div className="flex h-28 flex-col justify-end rounded-t-lg bg-yellow-400/20 p-3">
              <Crown className="mx-auto mb-1 h-6 w-6 text-yellow-400" />
              <p className="font-display max-w-20 truncate text-sm font-bold">
                {leaderboard[0]?.name}
              </p>
              <p className="text-muted-foreground text-xs">
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
            <div className="bg-card mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full border-2 border-amber-600 text-2xl">
              {leaderboard[2]?.avatar}
            </div>
            <div className="flex h-16 flex-col justify-end rounded-t-lg bg-amber-600/20 p-3">
              <Medal className="mx-auto mb-1 h-5 w-5 text-amber-600" />
              <p className="font-display max-w-16 truncate text-xs font-semibold">
                {leaderboard[2]?.name}
              </p>
              <p className="text-muted-foreground text-xs">
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
        <h2 className="font-display mb-3 text-lg font-bold">All Rankings</h2>
        <div className="space-y-2">
          {leaderboard.map((racer, index) => (
            <motion.div
              key={racer.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              className={`leaderboard-row ${getRankClass(racer.rank)} ${
                racer.name === "You" ? "border-primary" : ""
              }`}
            >
              <div className="flex w-8 justify-center">
                {getRankIcon(racer.rank)}
              </div>
              <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full text-xl">
                {racer.avatar}
              </div>
              <div className="flex-1">
                <p
                  className={`font-display font-semibold ${racer.name === "You" ? "text-primary" : ""}`}
                >
                  {racer.name}
                </p>
              </div>
              <p className="font-display text-muted-foreground font-bold">
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
