import { describe, it, expect } from 'vitest';
import { SecurityService } from './security.service';
import { UserRole } from '../common/enums/user-role.enum';

describe('SecurityService & RBAC (Unit Tests)', () => {
  const service = new SecurityService();

  it('debe contener los 4 roles del sistema reconocidos', () => {
    const roles = service.getRoles();
    expect(roles.length).toBe(4);
    const roleIds = roles.map((r) => r.role);
    expect(roleIds).toContain(UserRole.ROLE_USUARIO);
    expect(roleIds).toContain(UserRole.ROLE_LIDER);
    expect(roleIds).toContain(UserRole.ROLE_NACIONAL);
    expect(roleIds).toContain(UserRole.ROLE_DIRECTOR_GENERAL);
  });

  it('debe otorgar permisos pasivos de solo lectura al Director General', () => {
    expect(service.hasPermission(UserRole.ROLE_DIRECTOR_GENERAL, 'pdm.view')).toBe(true);
    expect(service.hasPermission(UserRole.ROLE_DIRECTOR_GENERAL, 'notes.manage')).toBe(true);
    expect(service.hasPermission(UserRole.ROLE_DIRECTOR_GENERAL, 'pdm.activities.edit')).toBe(false);
    expect(service.hasPermission(UserRole.ROLE_DIRECTOR_GENERAL, 'pdm.objectives.manage')).toBe(false);
    expect(service.hasPermission(UserRole.ROLE_DIRECTOR_GENERAL, 'security.roles.manage')).toBe(false);
  });

  it('debe restringir la mutación del PDM para el Usuario de Equipo', () => {
    expect(service.hasPermission(UserRole.ROLE_USUARIO, 'pdm.view')).toBe(true);
    expect(service.hasPermission(UserRole.ROLE_USUARIO, 'pdm.activities.edit')).toBe(false);
    expect(service.hasPermission(UserRole.ROLE_USUARIO, 'pdm.activities.delete')).toBe(false);
    expect(service.hasPermission(UserRole.ROLE_USUARIO, 'pdm.objectives.manage')).toBe(false);
  });

  it('debe habilitar control total para el Director Nacional', () => {
    expect(service.hasPermission(UserRole.ROLE_NACIONAL, 'pdm.view')).toBe(true);
    expect(service.hasPermission(UserRole.ROLE_NACIONAL, 'pdm.activities.edit')).toBe(true);
    expect(service.hasPermission(UserRole.ROLE_NACIONAL, 'security.roles.manage')).toBe(true);
    expect(service.hasPermission(UserRole.ROLE_NACIONAL, 'audit.history.view')).toBe(true);
  });
});
