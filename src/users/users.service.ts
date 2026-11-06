import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { createHash, randomBytes, randomUUID } from 'crypto';
import { UserRole } from '../common/enums/user-role.enum';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private users: User[] = [];

  constructor() {
    this.seedDefaultUsers();
  }

  private hashPassword(password: string): string {
    return createHash('sha256').update(password.trim()).digest('hex');
  }

  private seedDefaultUsers(): void {
    const defaultPassword = this.hashPassword('password123');
    const adminPass2026 = this.hashPassword('admin2026');
    const pastosPass = this.hashPassword('pastos2026');
    const wayuuPass = this.hashPassword('wayuu2026');
    const now = new Date().toISOString();

    this.users = [
      {
        id: 'usr-admin-1',
        email: 'director@misincol.org',
        fullName: 'Coordinador Nacional Misincol',
        passwordHash: adminPass2026,
        role: UserRole.ROLE_NACIONAL,
        createdAt: now,
        updatedAt: now,
        createdBy: 'SYSTEM',
      },
      {
        id: 'usr-admin-2',
        email: 'admin@misincol.org',
        fullName: 'Administrador Misincol',
        passwordHash: defaultPassword,
        role: UserRole.ROLE_NACIONAL,
        createdAt: now,
        updatedAt: now,
        createdBy: 'SYSTEM',
      },
      {
        id: 'usr-team-wayuu',
        email: 'wayuu@misincol.org',
        fullName: 'Líder Misión Wayúu',
        passwordHash: wayuuPass,
        role: UserRole.ROLE_LIDER,
        teamId: 'team-wayuu',
        createdAt: now,
        updatedAt: now,
        createdBy: 'SYSTEM',
      },
      {
        id: 'usr-team-pastos',
        email: 'pastos@misincol.org',
        fullName: 'Líder Misión Pastos',
        passwordHash: pastosPass,
        role: UserRole.ROLE_LIDER,
        teamId: 'team-pastos',
        createdAt: now,
        updatedAt: now,
        createdBy: 'SYSTEM',
      },
    ];
  }

  findByEmail(email: string): User | undefined {
    const clean = email.trim().toLowerCase();
    return this.users.find((u) => u.email.toLowerCase() === clean);
  }

  findById(id: string): User {
    const user = this.users.find((u) => u.id === id);
    if (!user) throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    return user;
  }

  findAll(role?: UserRole, teamId?: string): Omit<User, 'passwordHash'>[] {
    let result = [...this.users];
    if (role) result = result.filter((u) => u.role === role);
    if (teamId) result = result.filter((u) => u.teamId === teamId);
    return result.map(({ passwordHash, ...rest }) => rest);
  }

  create(dto: CreateUserDto, createdBy?: string): Omit<User, 'passwordHash'> {
    const existing = this.findByEmail(dto.email);
    if (existing) throw new ConflictException(`El correo ${dto.email} ya está registrado`);

    const now = new Date().toISOString();
    const newUser: User = {
      id: randomUUID(),
      email: dto.email.trim().toLowerCase(),
      fullName: dto.fullName.trim(),
      passwordHash: this.hashPassword(dto.password),
      role: dto.role,
      teamId: dto.teamId,
      createdAt: now,
      updatedAt: now,
      createdBy: createdBy || 'ROLE_NACIONAL',
      updatedBy: createdBy || 'ROLE_NACIONAL',
    };

    this.users.push(newUser);
    const { passwordHash, ...safeUser } = newUser;
    return safeUser;
  }

  updateRole(id: string, newRole: UserRole, updatedBy?: string): Omit<User, 'passwordHash'> {
    const user = this.findById(id);
    user.role = newRole;
    user.updatedAt = new Date().toISOString();
    if (updatedBy) user.updatedBy = updatedBy;
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  verifyPassword(user: User, plainPassword: string): boolean {
    const hashed = this.hashPassword(plainPassword);
    return user.passwordHash === hashed;
  }
}

