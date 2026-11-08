import { Team } from '../entities/team.entity';

export interface NationalBudgetKPIs {
  totalNationalBudget: number;
  totalExecutedBudget: number;
  totalRemainingBudget: number;
  globalExecutionPercentage: number;
  totalTeams: number;
  teamsAtAttention: number;
  teamsOptimal: number;
}

export interface TeamBudgetSummary {
  teamId: string;
  teamName: string;
  totalBudget: number;
  executedBudget: number;
  remainingBudget: number;
  budgetPercentage: number;
  remainingPercentage: number;
  currentPhaseId?: string;
  pillarBudgets: Record<string, number>;
  totalActivities: number;
  completedActivities: number;
}

export function calculateExecutionPercentage(executed: number, total: number): number {
  if (!total || total <= 0) return 0;
  return Math.min(100, Math.round((executed / total) * 100));
}

export function calculateNationalKPIs(teams: Team[]): NationalBudgetKPIs {
  const totalNationalBudget = teams.reduce((acc, t) => acc + (Number(t.totalBudget) || 0), 0);
  const totalExecutedBudget = teams.reduce((acc, t) => acc + (Number(t.executedBudget) || 0), 0);
  const totalRemainingBudget = Math.max(0, totalNationalBudget - totalExecutedBudget);
  const globalExecutionPercentage = calculateExecutionPercentage(totalExecutedBudget, totalNationalBudget);
  const teamsAtAttention = teams.filter((t) => t.healthStatus === 'Atención').length;
  const teamsOptimal = teams.filter((t) => t.healthStatus === 'Optimo').length;

  return {
    totalNationalBudget,
    totalExecutedBudget,
    totalRemainingBudget,
    globalExecutionPercentage,
    totalTeams: teams.length,
    teamsAtAttention,
    teamsOptimal,
  };
}

export function buildTeamBudgetSummary(team: Team, activitiesCount = { total: 0, completed: 0 }): TeamBudgetSummary {
  const total = Number(team.totalBudget) || 0;
  const executed = Number(team.executedBudget) || 0;
  const percentage = calculateExecutionPercentage(executed, total);
  const remainingBudget = Math.max(0, total - executed);
  const remainingPercentage = Math.max(0, 100 - percentage);

  return {
    teamId: team.id,
    teamName: team.name,
    totalBudget: total,
    executedBudget: executed,
    remainingBudget,
    budgetPercentage: percentage,
    remainingPercentage,
    currentPhaseId: team.currentPhaseId,
    pillarBudgets: team.pillarBudgets || {
      investigacion: 0,
      encarnacion: 0,
      evangelizacion: 0,
      entrenamiento: 0,
      autocuidado: 0,
    },
    totalActivities: activitiesCount.total,
    completedActivities: activitiesCount.completed,
  };
}
