import { Injectable, NotFoundException } from '@nestjs/common';
import { Team, TeamMember } from './entities/team.entity';
import { CreateTeamDto, AddTeamMemberDto } from './dto/create-team.dto';
import { INITIAL_TEAMS_DATA } from './helpers/initial-teams.data';
import {
  calculateExecutionPercentage,
  calculateNationalKPIs,
  buildTeamBudgetSummary,
  NationalBudgetKPIs,
  TeamBudgetSummary,
} from './helpers/team-budget.calculator';

@Injectable()
export class TeamsService {
  private readonly teams: Team[] = [...INITIAL_TEAMS_DATA];

  findAll(): Team[] {
    return this.teams.map((t) => ({
      ...t,
      budgetPercentage: calculateExecutionPercentage(t.executedBudget, t.totalBudget),
    }));
  }

  findOne(id: string): Team {
    const found = this.teams.find((t) => t.id === id);
    if (!found) throw new NotFoundException(`Equipo con ID '${id}' no encontrado.`);
    found.budgetPercentage = calculateExecutionPercentage(found.executedBudget, found.totalBudget);
    return found;
  }

  create(dto: CreateTeamDto, createdBy?: string): Team {
    const totalBudget = Number(dto.totalBudget) || 0;
    const executedBudget = Number(dto.executedBudget) || 0;
    const newTeam: Team = {
      id: `team-${Date.now()}`,
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
    this.teams.push(newTeam);
    return newTeam;
  }

  update(id: string, updates: Partial<Team>, updatedBy?: string): Team {
    const team = this.findOne(id);
    Object.assign(team, updates, {
      updatedBy: updatedBy || team.updatedBy,
    });
    team.budgetPercentage = calculateExecutionPercentage(team.executedBudget, team.totalBudget);
    return team;
  }

  addMember(teamId: string, memberDto: AddTeamMemberDto): TeamMember {
    const team = this.findOne(teamId);
    const newMember: TeamMember = {
      id: `tm-${Date.now()}`,
      teamId,
      ...memberDto,
    };
    team.members.push(newMember);
    return newMember;
  }

  delete(id: string): { success: boolean; message: string } {
    const index = this.teams.findIndex((t) => t.id === id);
    if (index === -1) throw new NotFoundException(`Equipo con ID '${id}' no encontrado.`);
    this.teams.splice(index, 1);
    return { success: true, message: `Equipo '${id}' eliminado correctamente.` };
  }

  getNationalKPIs(): NationalBudgetKPIs {
    return calculateNationalKPIs(this.teams);
  }

  getTeamBudgetSummary(teamId: string): TeamBudgetSummary {
    const team = this.findOne(teamId);
    return buildTeamBudgetSummary(team);
  }
}
