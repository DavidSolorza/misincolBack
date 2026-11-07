export class TeamMember {
  id: string;
  teamId: string;
  fullName: string;
  contactInfo: string;
  roleInTeam: string;
}

export type TeamHealthStatus = 'Optimo' | 'Atención' | 'Crítico';

export class Team {
  id: string;
  name: string;
  ethnicity?: string;
  region?: string;
  department?: string;
  location: string;
  population: number;
  evangelicaCongregations: number;
  evangelicalsCount: number;
  leader?: string;
  leaderPhone?: string;
  currentPhaseId?: string;
  totalBudget: number;
  executedBudget: number;
  budgetPercentage?: number;
  healthStatus?: TeamHealthStatus;
  themeColor?: string;
  accessPin?: string;
  pillarBudgets?: Record<string, number>;
  members: TeamMember[];
  createdBy?: string;
  updatedBy?: string;
}
