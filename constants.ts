import type { Challenge, LeaderboardEntry, SafeZone, UserStats } from "./types";

export const MOCK_USER_STATS: UserStats = {
  totalPoints: 12450,
  co2SavedKg: 45.2,
  racesCompleted: 34,
  currentStreak: 5,
};

export const DAILY_CHALLENGES: Challenge[] = [
  {
    id: "1",
    title: "Beat Rush Hour",
    description: "Complete a commute without idling > 2 mins",
    rewardPoints: 500,
    progress: 1,
    total: 1,
    icon: "clock",
  },
  {
    id: "2",
    title: "Green Pit Boss",
    description: "Use public transit or bike for 5km",
    rewardPoints: 750,
    progress: 3.2,
    total: 5,
    icon: "leaf",
  },
];

export const LEADERBOARD_DATA: LeaderboardEntry[] = [
  {
    id: "1",
    rank: 1,
    username: "EcoRacer_99",
    points: 15200,
    avatar: "https://picsum.photos/seed/user1/100/100",
    change: "same",
  },
  {
    id: "2",
    rank: 2,
    username: "GreenGrid_Pro",
    points: 14850,
    avatar: "https://picsum.photos/seed/user2/100/100",
    change: "up",
  },
  {
    id: "3",
    rank: 3,
    username: "SolarFlare",
    points: 14100,
    avatar: "https://picsum.photos/seed/user3/100/100",
    change: "down",
  },
  {
    id: "4",
    rank: 4,
    username: "Velocipedestrienne",
    points: 13500,
    avatar: "https://picsum.photos/seed/user4/100/100",
    change: "up",
  },
  {
    id: "5",
    rank: 5,
    username: "TransitTitan",
    points: 12000,
    avatar: "https://picsum.photos/seed/user5/100/100",
    change: "same",
  },
];

export const SAFE_ZONES: SafeZone[] = [
  {
    id: "z1",
    name: "Downtown Green Loop",
    type: "lane",
    lat: 40,
    lng: 20,
    difficulty: "medium",
  },
  {
    id: "z2",
    name: "Central Park Sprint",
    type: "park",
    lat: 60,
    lng: 50,
    difficulty: "easy",
  },
  {
    id: "z3",
    name: "Skyline EV Circuit",
    type: "track",
    lat: 25,
    lng: 70,
    difficulty: "hard",
  },
];

