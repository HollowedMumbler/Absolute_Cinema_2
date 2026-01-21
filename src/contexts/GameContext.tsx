import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

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
  refreshLeaderboard: () => Promise<void>;
}

// Static game data (keep hardcoded)
const vehicles: Vehicle[] = [
  { id: 'walk', name: 'Walking', icon: '🚶', ecoFactor: 2.0, description: 'Zero emissions, maximum eco points', unlockLevel: 1 },
  { id: 'bike', name: 'Bicycle', icon: '🚲', ecoFactor: 1.8, description: 'Fast and eco-friendly', unlockLevel: 1 },
  { id: 'scooter', name: 'E-Scooter', icon: '🛴', ecoFactor: 1.5, description: 'Electric mobility', unlockLevel: 3 },
  { id: 'bus', name: 'Public Transit', icon: '🚌', ecoFactor: 1.3, description: 'Shared transportation', unlockLevel: 5 },
  { id: 'electric_car', name: 'Electric Car', icon: '⚡', ecoFactor: 1.2, description: 'Premium electric racing', unlockLevel: 10 },
];

const badgeTemplates: Badge[] = [
  { id: 'first_ride', name: 'First Lap', description: 'Complete your first commute', icon: '🏁', unlocked: false },
  { id: 'green_pit_boss', name: 'Green Pit Boss', description: 'Save 10kg of CO2', icon: '🌿', unlocked: false },
  { id: 'speed_demon', name: 'Speed Demon', description: 'Complete 5 commutes in one day', icon: '⚡', unlocked: false },
  { id: 'eco_champion', name: 'Eco Champion', description: 'Reach Level 10', icon: '🏆', unlocked: false },
  { id: 'streak_master', name: 'Streak Master', description: '7 day commute streak', icon: '🔥', unlocked: false },
  { id: 'carbon_hero', name: 'Carbon Hero', description: 'Save 100kg of CO2', icon: '🌍', unlocked: false },
];

const challengeTemplates: Challenge[] = [
  { id: '1', title: 'Morning Rush', description: 'Complete a commute before 9 AM', target: 1, current: 0, reward: 50, type: 'daily', expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) },
  { id: '2', title: 'Green Miles', description: 'Travel 10km by bike or walking', target: 10, current: 0, reward: 100, type: 'daily', expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) },
  { id: '3', title: 'Earth Day Grand Prix', description: 'Participate in the global eco race', target: 50, current: 0, reward: 500, type: 'special', expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
];

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ name: 'EcoRacer', avatar: '🌟' });
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>('bike');
  const [badges, setBadges] = useState<Badge[]>(badgeTemplates);
  const [challenges, setChallenges] = useState<Challenge[]>(challengeTemplates);
  const [commuteLogs, setCommuteLogs] = useState<CommuteLog[]>([]);
  const [leaderboard, setLeaderboard] = useState<{ name: string; points: number; rank: number; avatar: string }[]>([]);
  
  const [stats, setStats] = useState<UserStats>({
    totalPoints: 0,
    level: 1,
    xp: 0,
    xpToNextLevel: 1000,
    totalDistance: 0,
    totalCarbonSaved: 0,
    totalCommutes: 0,
    currentStreak: 0,
    bestLapTime: 0,
    rank: 0,
  });

  // Helper function to convert avatar ID to emoji
  const getAvatarEmoji = (avatarId: string) => {
    const avatarMap: Record<string, string> = {
      'ev': '⚡',
      'bike': '🚴',
      'bus': '🚌',
      'scooter': '🛴',
      'walk': '🚶'
    };
    return avatarMap[avatarId] || '🌟';
  };

  // Load user data from Firestore
  useEffect(() => {
    const auth = getAuth();
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await loadUserData(firebaseUser.uid);
        await loadLeaderboard();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loadUserData = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, "mainUser", uid));
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        
        // Set user info
        setUser({
          name: data.name || 'EcoRacer',
          avatar: getAvatarEmoji(data.avatar) || '🌟'
        });

        // Set stats from Firestore
        setStats({
          totalPoints: data.points || 0,
          level: data.level || 1,
          xp: data.xp || 0,
          xpToNextLevel: data.xpToNextLevel || 1000,
          totalDistance: data.totalDistance || 0,
          totalCarbonSaved: data.coSaved || 0,
          totalCommutes: data.totalCommutes || 0,
          currentStreak: data.streak || 0,
          bestLapTime: data.bestLapTime || 0,
          rank: data.rank || 0,
        });

        // Load badges progress
        if (data.badges && Array.isArray(data.badges)) {
          setBadges(badgeTemplates.map(template => ({
            ...template,
            unlocked: data.badges.includes(template.id),
          })));
        }

        // Load challenge progress
        if (data.challenges && typeof data.challenges === 'object') {
          setChallenges(challengeTemplates.map(template => ({
            ...template,
            current: data.challenges[template.id] || 0
          })));
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const loadLeaderboard = async () => {
    try {
      const usersRef = collection(db, "mainUser");
      const q = query(usersRef, orderBy("points", "desc"), limit(50));
      const querySnapshot = await getDocs(q);

      const leaderboardData: any[] = [];
      let rank = 1;
      
      querySnapshot.forEach((docSnap) => {
        const userData = docSnap.data();
        leaderboardData.push({
          name: userData.name || 'Anonymous',
          points: userData.points || 0,
          rank: rank,
          avatar: getAvatarEmoji(userData.avatar) || '🌟',
        });
        rank++;
      });

      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error("Error loading leaderboard:", error);
    }
  };

  const saveUserData = async (updates: Partial<any>) => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    
    if (!currentUser) return;

    try {
      await updateDoc(doc(db, "mainUser", currentUser.uid), updates);
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  const addPoints = useCallback(async (points: number) => {
    setStats(prev => {
      const newXp = prev.xp + points;
      const levelUp = newXp >= prev.xpToNextLevel;
      const newStats = {
        ...prev,
        totalPoints: prev.totalPoints + points,
        xp: levelUp ? newXp - prev.xpToNextLevel : newXp,
        level: levelUp ? prev.level + 1 : prev.level,
        xpToNextLevel: levelUp ? Math.floor(prev.xpToNextLevel * 1.2) : prev.xpToNextLevel,
      };

      // Save to Firestore
      saveUserData({
        points: newStats.totalPoints,
        xp: newStats.xp,
        level: newStats.level,
        xpToNextLevel: newStats.xpToNextLevel,
      });

      return newStats;
    });
  }, []);

  const logCommute = useCallback(async (commute: Omit<CommuteLog, 'id' | 'points'>) => {
    const vehicle = vehicles.find(v => v.id === commute.mode);
    const points = Math.floor(commute.distance * (vehicle?.ecoFactor || 1) * 10);
    
    const newLog: CommuteLog = {
      ...commute,
      id: Date.now().toString(),
      points,
    };

    setCommuteLogs(prev => [newLog, ...prev]);
    addPoints(points);
    
    setStats(prev => {
      const newStats = {
        ...prev,
        totalDistance: prev.totalDistance + commute.distance,
        totalCarbonSaved: prev.totalCarbonSaved + commute.carbonSaved,
        totalCommutes: prev.totalCommutes + 1,
      };

      // Save to Firestore
      saveUserData({
        totalDistance: newStats.totalDistance,
        coSaved: newStats.totalCarbonSaved,
      });

      return newStats;
    });
  }, [addPoints]);

  const completeChallenge = useCallback(async (challengeId: string) => {
    setChallenges(prev => {
      const updated = prev.map(c => 
        c.id === challengeId ? { ...c, current: c.target } : c
      );

      // Save challenge progress to Firestore
      const challengeProgress: Record<string, number> = {};
      updated.forEach(c => {
        challengeProgress[c.id] = c.current;
      });
      saveUserData({ challenges: challengeProgress });

      return updated;
    });
  }, []);

  const refreshLeaderboard = async () => {
    await loadLeaderboard();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-white text-xl">Loading game data...</div>
      </div>
    );
  }

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
        refreshLeaderboard,
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