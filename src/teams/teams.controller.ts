import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto, AddTeamMemberDto } from './dto/create-team.dto';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  getAllTeams() {
    return this.teamsService.findAll();
  }

  @Get(':id')
  getTeam(@Param('id') id: string) {
    return this.teamsService.findOne(id);
  }

  @Post()
  createTeam(@Body() dto: CreateTeamDto) {
    return this.teamsService.create(dto);
  }

  @Post(':id/members')
  addMember(@Param('id') teamId: string, @Body() dto: AddTeamMemberDto) {
    return this.teamsService.addMember(teamId, dto);
  }

  @Delete(':id/members/:memberId')
  removeMember(@Param('id') teamId: string, @Param('memberId') memberId: string) {
    return { success: this.teamsService.removeMember(teamId, memberId) };
  }
}

