import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type VehicleType = 'electric_car' | 'bike' | 'bus' | 'scooter' | 'walk';

export interface Vehicle {
  id: VehicleType;
  name: string;
  icon: string;
  ecoFactor: number;
  description: string;
  unlockLevel: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  reward: number;
  type: 'daily' | 'weekly' | 'special';
  expiresAt: Date;
}

export interface CommuteLog {
  id: string;
  date: Date;
  distance: number;
  mode: VehicleType;
  duration: number;
  carbonSaved: number;
  points: number;
  route?: { lat: number; lng: number }[];
}

export interface UserStats {
  totalPoints: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalDistance: number;
  totalCarbonSaved: number;
  totalCommutes: number;
  currentStreak: number;
  bestLapTime: number;
  rank: number;
}

interface GameContextType {
  user: {
    name: string;
    avatar: string;
  };
  stats: UserStats;
  selectedVehicle: VehicleType;
  vehicles: Vehicle[];
  badges: Badge[];
  challenges: Challenge[];
  commuteLogs: CommuteLog[];
  leaderboard: { name: string; points: number; rank: number; avatar: string }[];
  setSelectedVehicle: (vehicle: VehicleType) => void;
  addPoints: (points: number) => void;
  logCommute: (commute: Omit<CommuteLog, 'id' | 'points'>) => void;
  completeChallenge: (challengeId: string) => void;
}

const vehicles: Vehicle[] = [
  { id: 'walk', name: 'Walking', icon: '🚶', ecoFactor: 2.0, description: 'Zero emissions, maximum eco points', unlockLevel: 1 },
  { id: 'bike', name: 'Bicycle', icon: '🚲', ecoFactor: 1.8, description: 'Fast and eco-friendly', unlockLevel: 1 },
  { id: 'scooter', name: 'E-Scooter', icon: '🛴', ecoFactor: 1.5, description: 'Electric mobility', unlockLevel: 3 },
  { id: 'bus', name: 'Public Transit', icon: '🚌', ecoFactor: 1.3, description: 'Shared transportation', unlockLevel: 5 },
  { id: 'electric_car', name: 'Electric Car', icon: '⚡', ecoFactor: 1.2, description: 'Premium electric racing', unlockLevel: 10 },
];

const initialBadges: Badge[] = [
  { id: 'first_ride', name: 'First Lap', description: 'Complete your first commute', icon: '🏁', unlocked: true },
  { id: 'green_pit_boss', name: 'Green Pit Boss', description: 'Save 10kg of CO2', icon: '🌿', unlocked: true },
  { id: 'speed_demon', name: 'Speed Demon', description: 'Complete 5 commutes in one day', icon: '⚡', unlocked: false },
  { id: 'eco_champion', name: 'Eco Champion', description: 'Reach Level 10', icon: '🏆', unlocked: false },
  { id: 'streak_master', name: 'Streak Master', description: '7 day commute streak', icon: '🔥', unlocked: false },
  { id: 'carbon_hero', name: 'Carbon Hero', description: 'Save 100kg of CO2', icon: '🌍', unlocked: false },
];

const initialChallenges: Challenge[] = [
  { id: '1', title: 'Morning Rush', description: 'Complete a commute before 9 AM', target: 1, current: 0, reward: 50, type: 'daily', expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) },
  { id: '2', title: 'Green Miles', description: 'Travel 10km by bike or walking', target: 10, current: 4.5, reward: 100, type: 'daily', expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) },
  { id: '3', title: 'Earth Day Grand Prix', description: 'Participate in the global eco race', target: 50, current: 23, reward: 500, type: 'special', expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
];

const initialLeaderboard = [
  { name: 'EcoRacer_Max', points: 15420, rank: 1, avatar: '🏎️' },
  { name: 'GreenSpeed_Pro', points: 14890, rank: 2, avatar: '🚀' },
  { name: 'You', points: 12750, rank: 3, avatar: '🌟' },
  { name: 'BikeNinja', points: 11230, rank: 4, avatar: '🥷' },
  { name: 'EcoWarrior', points: 10540, rank: 5, avatar: '⚔️' },
  { name: 'GreenMachine', points: 9870, rank: 6, avatar: '🤖' },
  { name: 'LeafRider', points: 8920, rank: 7, avatar: '🍃' },
];

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [user] = useState({ name: 'EcoRacer', avatar: '🌟' });
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>('bike');
  const [badges, setBadges] = useState<Badge[]>(initialBadges);
  const [challenges, setChallenges] = useState<Challenge[]>(initialChallenges);
  const [commuteLogs, setCommuteLogs] = useState<CommuteLog[]>([]);
  const [leaderboard] = useState(initialLeaderboard);
  
  const [stats, setStats] = useState<UserStats>({
    totalPoints: 12750,
    level: 8,
    xp: 2350,
    xpToNextLevel: 3000,
    totalDistance: 234.5,
    totalCarbonSaved: 45.2,
    totalCommutes: 67,
    currentStreak: 5,
    bestLapTime: 12.4,
    rank: 3,
  });

  const addPoints = useCallback((points: number) => {
    setStats(prev => {
      const newXp = prev.xp + points;
      const levelUp = newXp >= prev.xpToNextLevel;
      return {
        ...prev,
        totalPoints: prev.totalPoints + points,
        xp: levelUp ? newXp - prev.xpToNextLevel : newXp,
        level: levelUp ? prev.level + 1 : prev.level,
        xpToNextLevel: levelUp ? Math.floor(prev.xpToNextLevel * 1.2) : prev.xpToNextLevel,
      };
    });
  }, []);

  const logCommute = useCallback((commute: Omit<CommuteLog, 'id' | 'points'>) => {
    const vehicle = vehicles.find(v => v.id === commute.mode);
    const points = Math.floor(commute.distance * (vehicle?.ecoFactor || 1) * 10);
    
    const newLog: CommuteLog = {
      ...commute,
      id: Date.now().toString(),
      points,
    };

    setCommuteLogs(prev => [newLog, ...prev]);
    addPoints(points);
    
    setStats(prev => ({
      ...prev,
      totalDistance: prev.totalDistance + commute.distance,
      totalCarbonSaved: prev.totalCarbonSaved + commute.carbonSaved,
      totalCommutes: prev.totalCommutes + 1,
    }));
  }, [addPoints]);

  const completeChallenge = useCallback((challengeId: string) => {
    setChallenges(prev => prev.map(c => 
      c.id === challengeId ? { ...c, current: c.target } : c
    ));
  }, []);

  return (
    <GameContext.Provider
      value={{
        user,
        stats,
        selectedVehicle,
        vehicles,
        badges,
        challenges,
        commuteLogs,
        leaderboard,
        setSelectedVehicle,
        addPoints,
        logCommute,
        completeChallenge,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
