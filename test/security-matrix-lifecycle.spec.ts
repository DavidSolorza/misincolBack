import { describe, it, expect, beforeEach } from 'vitest';
import { SecurityService } from '../src/security/security.service';
import { UserRole } from '../src/common/enums/user-role.enum';

describe('SecurityMatrix Lifecycle & Mutation Tests (Backend Integration)', () => {
  let service: SecurityService;

  beforeEach(() => {
    service = new SecurityService();
  });

  it('Ciclo 1: Permite configurar permisos restrictivos y protege privilegios raíz', async () => {
    const configA = {
      [UserRole.ROLE_LIDER]: {
        'pdm.view': true,
        'pdm.activities.edit': false,
        'notes.manage': false,
        'reports.team.export': false,
      },
      [UserRole.ROLE_NACIONAL]: {
        'security.roles.manage': false, // Intento ilegal: debe ser saneado a true
        'audit.history.view': false,    // Intento ilegal: debe ser saneado a true
      },
      [UserRole.ROLE_DIRECTOR_GENERAL]: {
        'pdm.activities.edit': true,   // Intento ilegal: debe ser bloqueado a false
        'security.roles.manage': true, // Intento ilegal: debe ser bloqueado a false
      },
    };

    const resultA = await service.updateMatrix(configA as any);

    // Validación de recepción y ejecución
    expect(resultA[UserRole.ROLE_LIDER]['pdm.activities.edit']).toBe(false);
    expect(resultA[UserRole.ROLE_LIDER]['notes.manage']).toBe(false);
    expect(resultA[UserRole.ROLE_NACIONAL]['security.roles.manage']).toBe(true);
    expect(resultA[UserRole.ROLE_NACIONAL]['audit.history.view']).toBe(true);
    expect(resultA[UserRole.ROLE_DIRECTOR_GENERAL]['pdm.activities.edit']).toBe(false);
    expect(resultA[UserRole.ROLE_DIRECTOR_GENERAL]['security.roles.manage']).toBe(false);

    // Validación a través del método hasPermission
    expect(service.hasPermission(UserRole.ROLE_LIDER, 'notes.manage')).toBe(false);
    expect(service.hasPermission(UserRole.ROLE_NACIONAL, 'security.roles.manage')).toBe(true);
  });

  it('Ciclo 2: Permite invertir totalmente la matriz con configuración opuesta y verificar reflejo', async () => {
    const configB = {
      [UserRole.ROLE_LIDER]: {
        'pdm.view': true,
        'pdm.activities.edit': true,
        'notes.manage': true,
        'reports.team.export': true,
      },
      [UserRole.ROLE_USUARIO]: {
        'pdm.view': true,
        'pdm.activities.edit': true,
        'notes.manage': true,
      },
      [UserRole.ROLE_DIRECTOR_GENERAL]: {
        'pdm.view': true,
        'notes.manage': true,
        'reports.team.export': true,
        'reports.national.view': true,
      },
    };

    const resultB = await service.updateMatrix(configB as any);

    // Validación de la nueva configuración invertida
    expect(resultB[UserRole.ROLE_LIDER]['notes.manage']).toBe(true);
    expect(resultB[UserRole.ROLE_LIDER]['reports.team.export']).toBe(true);
    expect(resultB[UserRole.ROLE_USUARIO]['pdm.activities.edit']).toBe(true);
    expect(resultB[UserRole.ROLE_DIRECTOR_GENERAL]['reports.national.view']).toBe(true);

    // hasPermission debe responder fielmente al nuevo estado
    expect(service.hasPermission(UserRole.ROLE_LIDER, 'notes.manage')).toBe(true);
    expect(service.hasPermission(UserRole.ROLE_LIDER, 'reports.team.export')).toBe(true);
    expect(service.hasPermission(UserRole.ROLE_USUARIO, 'pdm.activities.edit')).toBe(true);
  });
});

