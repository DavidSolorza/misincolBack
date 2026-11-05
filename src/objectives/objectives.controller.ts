import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ObjectivesService } from './objectives.service';
import { CreateObjectiveDto, UpdateObjectiveDto } from './dto/create-objective.dto';
import { Objective } from './entities/objective.entity';

@Controller('objectives')
@UseGuards(JwtAuthGuard)
export class ObjectivesController {
  constructor(private readonly objectivesService: ObjectivesService) {}

  @Get()
  findAll(
    @Query('teamId') teamId?: string,
    @Query('pillarId') pillarId?: string,
  ): Objective[] {
    if (teamId && pillarId) {
      return this.objectivesService.findByTeamAndPillar(teamId, pillarId);
    }
    return this.objectivesService.findAll();
  }

  @Post()
  create(@Body() dto: CreateObjectiveDto, @Req() req: any): Objective {
    const creator = req.user?.email || 'Líder';
    return this.objectivesService.create(dto, creator);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateObjectiveDto, @Req() req: any): Objective {
    const updater = req.user?.email || 'Líder';
    return this.objectivesService.update(id, dto, updater);
  }

  @Delete(':id')
  delete(@Param('id') id: string): { success: boolean; message: string } {
    return this.objectivesService.delete(id);
  }
}
