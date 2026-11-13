import { Injectable, OnModuleInit, Optional } from '@nestjs/common';
import { UserRole } from '../common/enums/user-role.enum';
import { PermissionKey, SecurityMatrix, RoleConfigItem } from './entities/security-matrix.entity';
import { JsonDbService } from '../common/db/json-db.service';

const DEFAULT_MATRIX: SecurityMatrix = {
  [UserRole.ROLE_USUARIO]: {
    'pdm.view': true, 'pdm.activities.edit': false, 'pdm.activities.delete': false,
    'pdm.objectives.manage': false, 'team.tasks.assign': false, 'team.members.manage': false,
    'notes.manage': true, 'reports.team.export': false, 'reports.national.view': false,
    'audit.history.view': false, 'security.roles.manage': false,
  },
  [UserRole.ROLE_LIDER]: {
    'pdm.view': true, 'pdm.activities.edit': true, 'pdm.activities.delete': true,
    'pdm.objectives.manage': false, 'team.tasks.assign': true, 'team.members.manage': false,
    'notes.manage': true, 'reports.team.export': true, 'reports.national.view': false,
    'audit.history.view': false, 'security.roles.manage': false,
  },
  [UserRole.ROLE_NACIONAL]: {
    'pdm.view': true, 'pdm.activities.edit': true, 'pdm.activities.delete': true,
    'pdm.objectives.manage': true, 'team.tasks.assign': true, 'team.members.manage': true,
    'notes.manage': true, 'reports.team.export': true, 'reports.national.view': true,
    'audit.history.view': true, 'security.roles.manage': true,
  },
  [UserRole.ROLE_DIRECTOR_GENERAL]: {
    'pdm.view': true, 'pdm.activities.edit': false, 'pdm.activities.delete': false,
    'pdm.objectives.manage': false, 'team.tasks.assign': false, 'team.members.manage': false,
    'notes.manage': true, 'reports.team.export': false, 'reports.national.view': false,
    'audit.history.view': false, 'security.roles.manage': false,
  },
};

@Injectable()
export class SecurityService implements OnModuleInit {
  private matrix: Record<string, any> = { ...DEFAULT_MATRIX };

  constructor(@Optional() private readonly jsonDb?: JsonDbService) {}

  async onModuleInit(): Promise<void> {
    if (this.jsonDb) {
      const stored = await this.jsonDb.readObject<Record<string, any>>('security-matrix', DEFAULT_MATRIX);
      this.matrix = this.sanitizeGovernanceMatrix(stored);
    }
  }

  getMatrix(): Record<string, any> {
    return this.matrix;
  }

  getRoles(): RoleConfigItem[] {
    return [
      { role: UserRole.ROLE_USUARIO, displayName: 'Usuario equipo', description: 'Personal de campo con permisos restringidos de misión.' },
      { role: UserRole.ROLE_LIDER, displayName: 'Líder equipo', description: 'Pastor territorial responsable del PDM de la misión local.' },
      { role: UserRole.ROLE_NACIONAL, displayName: 'Coordinador de equipos', description: 'Coordinación general con privilegios raíz y supervisión nacional.' },
      { role: UserRole.ROLE_DIRECTOR_GENERAL, displayName: 'Director general', description: 'Observador pasivo de auditoría y reportes institucionales.' },
    ];
  }

  async updateMatrix(newMatrix: Record<string, any>): Promise<Record<string, any>> {
    const merged = { ...this.matrix, ...newMatrix };
    this.matrix = this.sanitizeGovernanceMatrix(merged);
    if (this.jsonDb) {
      await this.jsonDb.writeObject('security-matrix', this.matrix);
    }
    return this.matrix;
  }

  async syncUsers(users: any[]): Promise<{ savedCount: number }> {
    if (this.jsonDb && Array.isArray(users)) {
      await this.jsonDb.write('users', users);
    }
    return { savedCount: users?.length || 0 };
  }

  hasPermission(role: UserRole, permission: PermissionKey): boolean {
    return !!this.matrix[role]?.[permission];
  }

  private sanitizeGovernanceMatrix(raw: Record<string, any>): Record<string, any> {
    const clean = { ...raw };
    // 1. Coordinador de Equipos (ROLE_NACIONAL / national_director): Privilegios raíz protegidos
    for (const key of [UserRole.ROLE_NACIONAL, 'national_director']) {
      clean[key] = {
        ...(clean[key] || {}),
        'security.roles.manage': true,
        'audit.history.view': true,
        'reports.national.view': true,
        'pdm.view': true,
      };
    }
    // 2. Director General (ROLE_DIRECTOR_GENERAL / director_general): Prohibición de mutaciones
    for (const key of [UserRole.ROLE_DIRECTOR_GENERAL, 'director_general']) {
      clean[key] = {
        ...(clean[key] || {}),
        'pdm.activities.edit': false,
        'pdm.activities.delete': false,
        'pdm.objectives.manage': false,
        'team.members.manage': false,
        'security.roles.manage': false,
      };
    }
    // 3. Usuario de Equipo (ROLE_USUARIO / team_member): Restricción de facultades directivas
    for (const key of [UserRole.ROLE_USUARIO, 'team_member']) {
      clean[key] = {
        ...(clean[key] || {}),
        'security.roles.manage': false,
        'audit.history.view': false,
        'reports.national.view': false,
        'pdm.objectives.manage': false,
        'team.members.manage': false,
      };
    }
    // 4. Líder de Equipo (ROLE_LIDER / team_leader): Restricción de seguridad y telemetría nacional
    for (const key of [UserRole.ROLE_LIDER, 'team_leader']) {
      clean[key] = {
        ...(clean[key] || {}),
        'security.roles.manage': false,
        'reports.national.view': false,
        'audit.history.view': false,
      };
    }
    return clean;
  }
}
