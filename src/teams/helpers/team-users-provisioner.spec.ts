import { describe, it, expect, beforeEach } from 'vitest';
import { UsersService } from '../../users/users.service';
import { TeamUsersProvisioner } from './team-users-provisioner';
import { Team } from '../entities/team.entity';
import { CreateTeamDto } from '../dto/create-team.dto';
import { UserRole } from '../../common/enums/user-role.enum';

describe('TeamUsersProvisioner (POO & Account Provisioning Tests)', () => {
  let usersService: UsersService;
  let mockTeam: Team;

  beforeEach(() => {
    usersService = new UsersService();
    mockTeam = {
      id: 'team-embera-test',
      name: 'Misión Émbera Chamí',
      leader: 'Líder Émbera',
      location: 'Risaralda',
      population: 25000,
      evangelicaCongregations: 1,
      evangelicalsCount: 30,
      totalBudget: 8000000,
      executedBudget: 0,
      healthStatus: 'Optimo',
      currentPhaseId: 'investigacion',
      members: [],
    };
  });

  it('debe aprovisionar la cuenta del líder y las cuentas de integrantes con la contraseña unificada del equipo', () => {
    const dto: CreateTeamDto = {
      name: 'Misión Émbera Chamí',
      leader: 'Pastor David Arias',
      leaderEmail: 'david.arias@misincol.org',
      accessPin: 'pin2026',
      location: 'Risaralda',
      population: 25000,
      evangelicaCongregations: 1,
      evangelicalsCount: 30,
      totalBudget: 8000000,
      membersWithAccounts: [
        {
          fullName: 'Marta Pérez',
          email: 'marta.perez@misincol.org',
          roleInTeam: 'Coordinadora de Salud',
        },
        {
          fullName: 'Carlos Gómez',
          email: 'carlos.gomez@misincol.org',
          roleInTeam: 'Evangelismo Territorial',
        },
      ],
    };

    const members = TeamUsersProvisioner.provisionTeamAccounts(mockTeam, dto, usersService);

    expect(members.length).toBe(2);
    expect(members[0].fullName).toBe('Marta Pérez');
    expect(members[0].contactInfo).toBe('marta.perez@misincol.org');
    expect(members[0].roleInTeam).toBe('Coordinadora de Salud');
    expect(members[1].fullName).toBe('Carlos Gómez');

    // Comprobar cuenta del líder
    const leaderUser = usersService.findByEmail('david.arias@misincol.org');
    expect(leaderUser).toBeDefined();
    expect(leaderUser?.fullName).toBe('Pastor David Arias');
    expect(leaderUser?.role).toBe(UserRole.ROLE_LIDER);
    expect(leaderUser?.teamId).toBe('team-embera-test');

    // Comprobar cuenta de Marta Pérez
    const martaUser = usersService.findByEmail('marta.perez@misincol.org');
    expect(martaUser).toBeDefined();
    expect(martaUser?.fullName).toBe('Marta Pérez');
    expect(martaUser?.role).toBe(UserRole.ROLE_USUARIO);
    expect(martaUser?.teamId).toBe('team-embera-test');

    // Comprobar cuenta de Carlos Gómez con password por defecto (accessPin)
    const carlosUser = usersService.findByEmail('carlos.gomez@misincol.org');
    expect(carlosUser).toBeDefined();
    expect(carlosUser?.role).toBe(UserRole.ROLE_USUARIO);
    expect(carlosUser?.teamId).toBe('team-embera-test');
  });

  it('debe mantener compatibilidad con lista simple de nombres en texto plano', () => {
    const dto: CreateTeamDto = {
      name: 'Misión Guajira',
      location: 'Uribia',
      population: 5000,
      evangelicaCongregations: 0,
      evangelicalsCount: 10,
      totalBudget: 5000000,
      members: ['Samuel Epieyu', 'Ana Pusshaina'],
    };

    const members = TeamUsersProvisioner.provisionTeamAccounts(mockTeam, dto, usersService);

    expect(members.length).toBe(2);
    expect(members[0].fullName).toBe('Samuel Epieyu');
    expect(members[0].roleInTeam).toBe('Líder Pastoral');
    expect(members[1].fullName).toBe('Ana Pusshaina');
    expect(members[1].roleInTeam).toBe('Misionero de Campo');
  });
});

