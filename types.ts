export interface Player {
  name: string;
  role?: string;
  notes?: string;
}

export interface TeamStats {
  potential: number; // 0-100
  aggression: number; // 0-100
  experience: number; // 0-100
  costEfficiency: number; // 0-100 (Higher is cheaper/better value)
  readiness: number; // 0-100 (Immediate results)
}

export interface TeamData {
  id: string;
  name: string;
  roster: Player[];
  characteristics: string[];
  stats: TeamStats;
  themeColor: string;
  summary: string;
}

export enum ViewMode {
  INTRO = 'INTRO',
  DASHBOARD = 'DASHBOARD',
  DETAIL = 'DETAIL',
  COMPARISON = 'COMPARISON',
  BUILDER = 'BUILDER',
  ADMIN_LOGIN = 'ADMIN_LOGIN',
  PRESENTATION = 'PRESENTATION',
  ROSTER_BUILDER = 'ROSTER_BUILDER'
}