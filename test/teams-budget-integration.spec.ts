import { describe, it, expect, beforeEach } from 'vitest';
import { TeamsController } from '../src/teams/teams.controller';
import { TeamsService } from '../src/teams/teams.service';

describe('Teams & Budget API (General Integration Tests)', () => {
  let controller: TeamsController;
  let service: TeamsService;

  beforeEach(() => {
    service = new TeamsService();
    controller = new TeamsController(service);
  });

  it('GET /teams: debe retornar los 6 equipos territoriales con presupuestos oficiales', () => {
    const teams = controller.findAll();
    expect(teams.length).toBe(6);

    const totalSum = teams.reduce((acc, t) => acc + t.totalBudget, 0);
    expect(totalSum).toBe(94610000);
  });

  it('GET /teams/summary/kpis: debe calcular los KPIs nacionales consolidados', () => {
    const kpis = controller.getNationalKPIs();
    expect(kpis.totalTeams).toBe(6);
    expect(kpis.totalNationalBudget).toBe(94610000);
    expect(kpis.totalExecutedBudget).toBe(44206000);
    expect(kpis.globalExecutionPercentage).toBe(47);
  });

  it('GET /teams/:id: debe retornar la Misión Pastos con desglose de $11,210,000 COP', () => {
    const team = controller.findOne('team-pastos');
    expect(team.id).toBe('team-pastos');
    expect(team.totalBudget).toBe(11210000);
    expect(team.executedBudget).toBe(4200000);
    expect(team.pillarBudgets?.entrenamiento).toBe(11210000);
    expect(team.pillarBudgets?.investigacion).toBe(0);
  });

  it('GET /teams/:id/budget-summary: debe conciliar el presupuesto de la misión', () => {
    const summary = controller.getTeamBudgetSummary('team-pastos');
    expect(summary.teamId).toBe('team-pastos');
    expect(summary.totalBudget).toBe(11210000);
    expect(summary.executedBudget).toBe(4200000);
    expect(summary.budgetPercentage).toBe(37);
  });

  it('POST /teams/reset-database: debe reiniciar a estado limpio verificado', async () => {
    controller.create(
      {
        name: 'Misión Experimental',
        location: 'Guaviare',
        population: 500,
        evangelicaCongregations: 1,
        evangelicalsCount: 20,
        totalBudget: 3000000,
      },
      { user: { email: 'director@misincol.org' } }
    );
    expect(controller.findAll().length).toBe(7);

    const reset = await controller.resetDatabase();
    expect(reset.length).toBe(6);
    expect(reset.reduce((acc, t) => acc + t.totalBudget, 0)).toBe(94610000);
  });
});
