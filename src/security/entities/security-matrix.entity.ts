import { UserRole } from '../../common/enums/user-role.enum';

export type PermissionKey =
  | 'pdm.view'
  | 'pdm.activities.edit'
  | 'pdm.activities.delete'
  | 'pdm.objectives.manage'
  | 'team.tasks.assign'
  | 'team.members.manage'
  | 'notes.manage'
  | 'reports.team.export'
  | 'reports.national.view'
  | 'audit.history.view'
  | 'security.roles.manage';

export type SecurityMatrix = Record<UserRole, Record<PermissionKey, boolean>>;

export interface RoleConfigItem {
  role: UserRole;
  displayName: string;
  description: string;
}

