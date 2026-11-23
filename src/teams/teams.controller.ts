import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { TeamsService } from './teams.service';
import { CreateTeamDto, AddTeamMemberDto } from './dto/create-team.dto';
import { Team, TeamMember } from './entities/team.entity';

@Controller('teams')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  findAll(): Team[] {
    return this.teamsService.findAll();
  }

  @Get('summary/kpis')
  getNationalKPIs() {
    return this.teamsService.getNationalKPIs();
  }

  @Post('reset-database')
  @Roles(UserRole.ROLE_NACIONAL)
  resetDatabase(): Promise<Team[]> {
    return this.teamsService.resetCleanDatabase();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Team {
    return this.teamsService.findOne(id);
  }

  @Get(':id/budget-summary')
  getTeamBudgetSummary(@Param('id') id: string) {
    return this.teamsService.getTeamBudgetSummary(id);
  }

  @Post()
  @Roles(UserRole.ROLE_NACIONAL)
  create(@Body() dto: CreateTeamDto, @Req() req: any): Team {
    const creator = req.user?.email || 'ROLE_NACIONAL';
    return this.teamsService.create(dto, creator);
  }

  @Put(':id')
  @Roles(UserRole.ROLE_NACIONAL)
  update(@Param('id') id: string, @Body() dto: Partial<CreateTeamDto>, @Req() req: any): Team {
    const updater = req.user?.email || 'ROLE_NACIONAL';
    return this.teamsService.update(id, dto as any, updater);
  }

  @Patch(':id')
  @Roles(UserRole.ROLE_NACIONAL)
  patch(@Param('id') id: string, @Body() dto: Partial<CreateTeamDto>, @Req() req: any): Team {
    const updater = req.user?.email || 'ROLE_NACIONAL';
    return this.teamsService.update(id, dto as any, updater);
  }

  @Post(':id/members')
  addMember(@Param('id') id: string, @Body() memberDto: AddTeamMemberDto): TeamMember {
    return this.teamsService.addMember(id, memberDto);
  }

  @Delete(':id')
  @Roles(UserRole.ROLE_NACIONAL)
  delete(@Param('id') id: string): { success: boolean; message: string } {
    return this.teamsService.delete(id);
  }
}

