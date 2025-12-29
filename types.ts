
export interface Player {
  id: string;
  name: string;
  icon: string;
  scores: (number | null)[];
}

export interface Game {
  id: number;
  targetScore: number;
  roundCount: number;
  players: Player[];
  reorderEnabled?: boolean;
}

export type View = 'dashboard' | 'game';
export type LeaderboardMetric = 'wins' | 'score';
export type Theme = 'light' | 'dark';

export interface AppState {
  view: View;
  activeGameId: number | null;
  leaderboardMetric: LeaderboardMetric;
  theme: Theme;
  games: Game[];
  reorderEnabled: boolean;
}
