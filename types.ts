export enum ViewState {
  DASHBOARD = "DASHBOARD",
  MAP_RACE = "MAP_RACE",
  LEADERBOARD = "LEADERBOARD",
  PROFILE = "PROFILE",
  AI_COACH = "AI_COACH",
}

export enum TransportMode {
  WALK = "WALK",
  BIKE = "BIKE",
  EV = "EV",
  TRANSIT = "TRANSIT",
}

export interface UserStats {
  totalPoints: number;
  co2SavedKg: number;
  racesCompleted: number;
  currentStreak: number;
}

export interface LeaderboardEntry {
  id: string;
  rank: number;
  username: string;
  points: number;
  avatar: string;
  change: "up" | "down" | "same";
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  rewardPoints: number;
  progress: number;
  total: number;
  icon: string;
}

export interface SafeZone {
  id: string;
  name: string;
  type: "park" | "track" | "lane";
  lat: number;
  lng: number;
  difficulty: "easy" | "medium" | "hard";
}

