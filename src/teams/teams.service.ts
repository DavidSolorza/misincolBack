import { Injectable, NotFoundException, OnModuleInit, Optional } from '@nestjs/common';
import { Team, TeamMember } from './entities/team.entity';
import { CreateTeamDto, AddTeamMemberDto } from './dto/create-team.dto';
import { INITIAL_TEAMS_DATA } from './helpers/initial-teams.data';
import { JsonDbService } from '../common/db/json-db.service';
import { validatePillarBudgets } from './validators/pillar-budget.validator';
import { UsersService } from '../users/users.service';
import { TeamUsersProvisioner } from './helpers/team-users-provisioner';
import {
  calculateExecutionPercentage,
  calculateNationalKPIs,
  buildTeamBudgetSummary,
  NationalBudgetKPIs,
  TeamBudgetSummary,
} from './helpers/team-budget.calculator';

@Injectable()
export class TeamsService implements OnModuleInit {
  private teams: Team[] = [...INITIAL_TEAMS_DATA];

  constructor(
    @Optional() private readonly jsonDb?: JsonDbService,
    @Optional() private readonly usersService?: UsersService,
  ) {}

  async onModuleInit(): Promise<void> {
    if (this.jsonDb) {
      const stored = await this.jsonDb.read<Team>('teams', INITIAL_TEAMS_DATA);
      if (stored && stored.length > 0) this.teams = [...stored];
    }
  }

  findAll(): Team[] {
    return this.teams.map((t) => ({
      ...t,
      budgetPercentage: calculateExecutionPercentage(t.executedBudget, t.totalBudget),
    }));
  }

  findOne(id: string): Team {
    const found = this.teams.find((t) => t.id === id || (t.slug && t.slug === id));
    if (!found) throw new NotFoundException(`Equipo con ID '${id}' no encontrado.`);
    found.budgetPercentage = calculateExecutionPercentage(found.executedBudget, found.totalBudget);
    return found;
  }

  create(dto: CreateTeamDto, createdBy?: string): Team {
    const totalBudget = Number(dto.totalBudget) || 0;
    const executedBudget = Number(dto.executedBudget) || 0;
    const teamId = dto.id || (dto.slug ? dto.slug : `team-${Date.now()}`);
    const newTeam: Team = {
      id: teamId,
      slug: dto.slug || teamId,
      ...dto,
      totalBudget,
      executedBudget,
      budgetPercentage: calculateExecutionPercentage(executedBudget, totalBudget),
      healthStatus: dto.healthStatus || 'Optimo',
      currentPhaseId: dto.currentPhaseId || 'investigacion',
      pillarBudgets: { investigacion: 0, encarnacion: 0, evangelizacion: 0, entrenamiento: 0, autocuidado: 0 },
      members: [],
      createdBy: createdBy || 'ROLE_NACIONAL',
      updatedBy: createdBy || 'ROLE_NACIONAL',
    };
    if (this.usersService) {
      newTeam.members = TeamUsersProvisioner.provisionTeamAccounts(newTeam, dto, this.usersService);
    } else if (dto.members && dto.members.length > 0) {
      newTeam.members = dto.members.map((name, idx) => ({
        id: `tm-${Date.now()}-${idx + 1}`,
        teamId: newTeam.id,
        fullName: name.trim(),
        contactInfo: '',
        roleInTeam: idx === 0 ? 'Líder Pastoral' : 'Misionero de Campo',
      }));
    }
    this.teams.push(newTeam);
    this.persist();
    return newTeam;
  }

  update(id: string, updates: Partial<Team>, updatedBy?: string): Team {
    const team = this.findOne(id);
    const targetTotalBudget = updates.totalBudget !== undefined ? Number(updates.totalBudget) : team.totalBudget;
    const targetPillarBudgets = updates.pillarBudgets || team.pillarBudgets;

    validatePillarBudgets(targetTotalBudget, targetPillarBudgets);

    Object.assign(team, updates, { updatedBy: updatedBy || team.updatedBy });
    team.budgetPercentage = calculateExecutionPercentage(team.executedBudget, team.totalBudget);
    this.persist();
    return team;
  }

  addMember(teamId: string, memberDto: AddTeamMemberDto): TeamMember {
    const team = this.findOne(teamId);
    const newMember: TeamMember = { id: `tm-${Date.now()}`, teamId, ...memberDto };
    team.members.push(newMember);
    this.persist();
    return newMember;
  }

  delete(id: string): { success: boolean; message: string } {
    const index = this.teams.findIndex((t) => t.id === id);
    if (index === -1) throw new NotFoundException(`Equipo con ID '${id}' no encontrado.`);
    this.teams.splice(index, 1);
    this.persist();
    return { success: true, message: `Equipo '${id}' eliminado correctamente.` };
  }

  async resetCleanDatabase(): Promise<Team[]> {
    this.teams = [...INITIAL_TEAMS_DATA];
    this.persist();
    return this.findAll();
  }

  private persist(): void {
    if (this.jsonDb) this.jsonDb.write('teams', this.teams).catch(() => {});
  }

  getNationalKPIs(): NationalBudgetKPIs {
    return calculateNationalKPIs(this.teams);
  }

  getTeamBudgetSummary(teamId: string): TeamBudgetSummary {
    const team = this.findOne(teamId);
    return buildTeamBudgetSummary(team);
  }
}
