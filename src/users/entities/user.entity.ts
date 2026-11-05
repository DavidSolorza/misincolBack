import { UserRole } from '../../common/enums/user-role.enum';

export class User {
  id: string;
  email: string;
  fullName: string;
  passwordHash: string;
  role: UserRole;
  teamId?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}
