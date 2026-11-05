import { Injectable, NotFoundException } from '@nestjs/common';
import { Team, TeamMember } from './entities/team.entity';
import { CreateTeamDto, AddTeamMemberDto } from './dto/create-team.dto';

@Injectable()
export class TeamsService {
  private readonly teams: Team[] = [
    {
      id: 'team-wayuu',
      name: 'Misión Alta Guajira (Wayuu)',
      location: 'Uribia y Nazaret, La Guajira',
      population: 380400,
      evangelicaCongregations: 14,
      evangelicalsCount: 1250,
      leader: 'Pr. Carlos Pushaina',
      leaderPhone: '+57 312 456 7890',
      members: [
        { id: 'tm-1', teamId: 'team-wayuu', fullName: 'Carlos Pushaina', contactInfo: '+57 312 456 7890', roleInTeam: 'Líder Pastoral' },
        { id: 'tm-2', teamId: 'team-wayuu', fullName: 'Marta Epieyu', contactInfo: '+57 315 889 0011', roleInTeam: 'Traducción y Niñez' },
      ],
      createdBy: 'SYSTEM',
    },
    {
      id: 'team-pastos',
      name: 'Misión Gran Cumbal (Pastos)',
      location: 'Cumbal y Chiles, Nariño',
      population: 162000,
      evangelicaCongregations: 9,
      evangelicalsCount: 820,
      leader: 'Pr. Segundo Ceballos',
      leaderPhone: '+57 311 234 5678',
      members: [
        { id: 'tm-3', teamId: 'team-pastos', fullName: 'Segundo Ceballos', contactInfo: '+57 311 234 5678', roleInTeam: 'Coordinador General' },
      ],
      createdBy: 'SYSTEM',
    },
    {
      id: 'team-nasa',
      name: 'Misión Tierradentro (Nasa)',
      location: 'Belalcázar e Inzá, Cauca',
      population: 243000,
      evangelicaCongregations: 22,
      evangelicalsCount: 3100,
      leader: 'Pr. Manuel Yonda',
      leaderPhone: '+57 314 901 2345',
      members: [],
      createdBy: 'SYSTEM',
    },
  ];

  findAll(): Team[] { return this.teams; }

  findOne(id: string): Team {
    const found = this.teams.find((t) => t.id === id);
    if (!found) throw new NotFoundException(`Equipo con ID '${id}' no encontrado.`);
    return found;
  }

  create(dto: CreateTeamDto, createdBy?: string): Team {
    const newTeam: Team = {
      id: `team-${Date.now()}`,
      ...dto,
      members: [],
      createdBy: createdBy || 'ROLE_NACIONAL',
      updatedBy: createdBy || 'ROLE_NACIONAL',
    };
    this.teams.push(newTeam);
    return newTeam;
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
}
