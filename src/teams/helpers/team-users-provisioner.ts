import { randomUUID } from 'crypto';
import { UserRole } from '../../common/enums/user-role.enum';
import { UsersService } from '../../users/users.service';
import { Team, TeamMember } from '../entities/team.entity';
import { CreateTeamDto } from '../dto/create-team.dto';

// Aprovisionador POO para la creacion de cuentas de acceso vinculadas al equipo misionero
export class TeamUsersProvisioner {
  static provisionTeamAccounts(team: Team, dto: CreateTeamDto, usersService: UsersService): TeamMember[] {
    const teamPassword = dto.accessPin?.trim() || 'misincol2026';
    const teamMembers: TeamMember[] = [];

    // 1. Aprovisionamiento de cuenta para el Lider Territorial (con la contrasena unificada del equipo)
    if (dto.leaderEmail) {
      const cleanLeaderEmail = dto.leaderEmail.trim().toLowerCase();
      const existingLeader = usersService.findByEmail(cleanLeaderEmail);
      if (!existingLeader) {
        usersService.create({
          email: cleanLeaderEmail,
          fullName: dto.leader || 'Líder Pastoral',
          password: teamPassword,
          role: UserRole.ROLE_LIDER,
          teamId: team.id,
        });
      }
    }

    // 2. Aprovisionamiento de cuentas para los Integrantes (todos con la misma contrasena del equipo)
    if (dto.membersWithAccounts && dto.membersWithAccounts.length > 0) {
      dto.membersWithAccounts.forEach((m, idx) => {
        const cleanEmail = m.email.trim().toLowerCase();
        const existing = usersService.findByEmail(cleanEmail);
        if (!existing) {
          usersService.create({
            email: cleanEmail,
            fullName: m.fullName.trim(),
            password: teamPassword,
            role: UserRole.ROLE_USUARIO,
            teamId: team.id,
          });
        }

        teamMembers.push({
          id: `tm-${Date.now()}-${idx + 1}`,
          teamId: team.id,
          fullName: m.fullName.trim(),
          contactInfo: cleanEmail,
          roleInTeam: m.roleInTeam || 'Misionero de Campo',
        });
      });
      return teamMembers;
    }

    // 3. Fallback para nombres simples recibidos como arreglo de cadenas
    if (dto.members && dto.members.length > 0) {
      dto.members.forEach((name, idx) => {
        teamMembers.push({
          id: `tm-${Date.now()}-${idx + 1}`,
          teamId: team.id,
          fullName: name.trim(),
          contactInfo: '',
          roleInTeam: idx === 0 ? 'Líder Pastoral' : 'Misionero de Campo',
        });
      });
    }

    return teamMembers;
  }
}

