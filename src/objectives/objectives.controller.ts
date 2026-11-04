import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ObjectivesService } from './objectives.service';
import { CreateObjectiveDto, UpdateObjectiveDto } from './dto/create-objective.dto';

@Controller('objectives')
export class ObjectivesController {
  constructor(private readonly objectivesService: ObjectivesService) {}

  @Get()
  getObjectives(@Query('teamId') teamId?: string, @Query('pillarId') pillarId?: string) {
    if (teamId && pillarId) {
      return this.objectivesService.findByTeamAndPillar(teamId, pillarId);
    }
    return this.objectivesService.findAll();
  }

  @Post()
  createObjective(@Body() dto: CreateObjectiveDto) {
    return this.objectivesService.create(dto);
  }

  @Put(':id')
  updateObjective(@Param('id') id: string, @Body() dto: UpdateObjectiveDto) {
    return this.objectivesService.update(id, dto);
  }

  @Delete(':id')
  deleteObjective(@Param('id') id: string) {
    return this.objectivesService.delete(id);
  }
}

