import { describe, it, expect, beforeEach } from 'vitest';
import { BadRequestException } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { UsersService } from '../users/users.service';

describe('TeamsService (Unit & State Tests)', () => {
  let service: TeamsService;
  let usersService: UsersService;

  beforeEach(() => {
    usersService = new UsersService();
    service = new TeamsService(undefined, usersService);
  });

  it('debe listar los 6 equipos con el porcentaje de presupuesto calculado', () => {
    const teams = service.findAll();
    expect(teams.length).toBe(6);
    teams.forEach((t) => {
      expect(t.budgetPercentage).toBeDefined();
      expect(t.totalBudget).toBeGreaterThan(0);
    });
  });

  it('debe obtener la Misión Pastos con las cifras exactas del PDM oficial', () => {
    const pastos = service.findOne('team-pastos');
    expect(pastos.name).toBe('Misión Pastos - Cumbal');
    expect(pastos.totalBudget).toBe(11210000);
    expect(pastos.executedBudget).toBe(4200000);
    expect(pastos.currentPhaseId).toBe('entrenamiento');
    expect(pastos.pillarBudgets?.entrenamiento).toBe(11210000);
  });

  it('debe retornar KPIs nacionales consolidados coherentes al 100%', () => {
    const kpis = service.getNationalKPIs();
    expect(kpis.totalTeams).toBe(6);
    expect(kpis.totalNationalBudget).toBe(94610000);
    expect(kpis.totalExecutedBudget).toBe(44206000);
    expect(kpis.globalExecutionPercentage).toBe(47);
  });

  it('debe agregar integrantes a un equipo territorial', () => {
    const member = service.addMember('team-pastos', {
      fullName: 'Misionero Prueba',
      contactInfo: '+57 300 000 0000',
      roleInTeam: 'Apoyo Pastoral',
    });
    expect(member.id).toBeDefined();
    expect(member.fullName).toBe('Misionero Prueba');

    const pastos = service.findOne('team-pastos');
    expect(pastos.members.some((m) => m.fullName === 'Misionero Prueba')).toBe(true);
  });

  it('debe rechazar actualizaciones de presupuesto por pilar que superen el presupuesto anual del equipo', () => {
    expect(() => {
      service.update('team-pastos', {
        pillarBudgets: {
          investigacion: 0,
          encarnacion: 0,
          evangelizacion: 0,
          entrenamiento: 15000000,
          autocuidado: 0,
        },
      });
    }).toThrow(BadRequestException);
  });

  it('debe restablecer la base de datos a las semillas oficiales limpias', async () => {
    service.create({
      name: 'Equipo Temporal',
      location: 'Ubicación Temp',
      population: 1000,
      evangelicaCongregations: 1,
      evangelicalsCount: 50,
      totalBudget: 5000000,
    });
    expect(service.findAll().length).toBe(7);

    const clean = await service.resetCleanDatabase();
    expect(clean.length).toBe(6);
  });

  it('debe aprovisionar usuarios en UsersService al crear un equipo con integrantes con cuentas', () => {
    const created = service.create({
      name: 'Misión Vaupés',
      leader: 'Líder Vaupés',
      leaderEmail: 'lider.vaupes@misincol.org',
      accessPin: 'vaupes2026',
      location: 'Mitú',
      population: 40000,
      evangelicaCongregations: 1,
      evangelicalsCount: 100,
      totalBudget: 15000000,
      membersWithAccounts: [
        {
          fullName: 'Misionero Pedro',
          email: 'pedro.vaupes@misincol.org',
          roleInTeam: 'Logística de Selva',
        },
      ],
    });

    expect(created.id).toBeDefined();
    expect(created.members.length).toBe(1);
    expect(created.members[0].contactInfo).toBe('pedro.vaupes@misincol.org');

    const pedroUser = usersService.findByEmail('pedro.vaupes@misincol.org');
    expect(pedroUser).toBeDefined();
    expect(pedroUser?.teamId).toBe(created.id);
  });
});
