import { Injectable } from '@nestjs/common';
import { UserRole } from '../common/enums/user-role.enum';
import { PermissionKey, SecurityMatrix, RoleConfigItem } from './entities/security-matrix.entity';

@Injectable()
export class SecurityService {
  private matrix: SecurityMatrix = {
    [UserRole.ROLE_USUARIO]: {
      'pdm.view': true,
      'pdm.activities.edit': false,
      'pdm.activities.delete': false,
      'pdm.objectives.manage': false,
      'team.tasks.assign': false,
      'team.members.manage': false,
      'notes.manage': true,
      'reports.team.export': false,
      'reports.national.view': false,
      'audit.history.view': false,
      'security.roles.manage': false,
    },
    [UserRole.ROLE_LIDER]: {
      'pdm.view': true,
      'pdm.activities.edit': true,
      'pdm.activities.delete': true,
      'pdm.objectives.manage': false,
      'team.tasks.assign': true,
      'team.members.manage': false,
      'notes.manage': true,
      'reports.team.export': true,
      'reports.national.view': false,
      'audit.history.view': false,
      'security.roles.manage': false,
    },
    [UserRole.ROLE_NACIONAL]: {
      'pdm.view': true,
      'pdm.activities.edit': true,
      'pdm.activities.delete': true,
      'pdm.objectives.manage': true,
      'team.tasks.assign': true,
      'team.members.manage': true,
      'notes.manage': true,
      'reports.team.export': true,
      'reports.national.view': true,
      'audit.history.view': true,
      'security.roles.manage': true,
    },
  };

  getMatrix(): SecurityMatrix {
    return this.matrix;
  }

  getRoles(): RoleConfigItem[] {
    return [
      {
        role: UserRole.ROLE_USUARIO,
        displayName: 'Usuario equipo',
        description: 'Miembro del equipo misionero en territorio con permisos operativos de campo.',
      },
      {
        role: UserRole.ROLE_LIDER,
        displayName: 'Líder equipo',
        description: 'Pastor o líder territorial a cargo del PDM de la misión local.',
      },
      {
        role: UserRole.ROLE_NACIONAL,
        displayName: 'Director nacional',
        description: 'Coordinador general con acceso a supervisión, roles y telemetría nacional.',
      },
    ];
  }

  updateMatrix(newMatrix: SecurityMatrix): SecurityMatrix {
    this.matrix = { ...this.matrix, ...newMatrix };
    return this.matrix;
  }

  hasPermission(role: UserRole, permission: PermissionKey): boolean {
    return !!this.matrix[role]?.[permission];
  }
}
