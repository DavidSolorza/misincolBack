import { describe, it, expect } from 'vitest';
import {
  calculateExecutionPercentage,
  calculateNationalKPIs,
  buildTeamBudgetSummary,
} from './team-budget.calculator';
import { INITIAL_TEAMS_DATA } from './initial-teams.data';

describe('TeamBudgetCalculator (Unit Tests)', () => {
  it('debe calcular correctamente el porcentaje de ejecución entera', () => {
    expect(calculateExecutionPercentage(4200000, 11210000)).toBe(37);
    expect(calculateExecutionPercentage(0, 11210000)).toBe(0);
    expect(calculateExecutionPercentage(1000, 0)).toBe(0);
    expect(calculateExecutionPercentage(11210000, 11210000)).toBe(100);
  });

  it('debe consolidar exactamente los KPIs de los 6 equipos nacionales', () => {
    const kpis = calculateNationalKPIs(INITIAL_TEAMS_DATA);

    expect(kpis.totalTeams).toBe(6);
    expect(kpis.totalNationalBudget).toBe(94610000);
    expect(kpis.totalExecutedBudget).toBe(44206000);
    expect(kpis.totalRemainingBudget).toBe(50404000);
    expect(kpis.globalExecutionPercentage).toBe(47);
  });

  it('debe construir el resumen presupuestal de Pastos fiel al Excel oficial', () => {
    const pastos = INITIAL_TEAMS_DATA.find((t) => t.id === 'team-pastos');
    expect(pastos).toBeDefined();

    const summary = buildTeamBudgetSummary(pastos!, { total: 6, completed: 1 });
    expect(summary.teamId).toBe('team-pastos');
    expect(summary.totalBudget).toBe(11210000);
    expect(summary.executedBudget).toBe(4200000);
    expect(summary.remainingBudget).toBe(7010000);
    expect(summary.budgetPercentage).toBe(37);
    expect(summary.remainingPercentage).toBe(63);
    expect(summary.pillarBudgets.entrenamiento).toBe(11210000);
    expect(summary.pillarBudgets.investigacion).toBe(0);
  });
});
