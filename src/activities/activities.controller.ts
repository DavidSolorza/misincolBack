import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto, UpdateActivityDto } from './dto/create-activity.dto';
import { Activity } from './entities/activity.entity';

@Controller('activities')
@UseGuards(JwtAuthGuard)
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get()
  findAll(@Query('objectiveId') objectiveId?: string): Activity[] {
    return this.activitiesService.findAll(objectiveId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Activity {
    return this.activitiesService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateActivityDto): Activity {
    return this.activitiesService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateActivityDto): Activity {
    return this.activitiesService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string): { success: boolean; message: string } {
    return this.activitiesService.delete(id);
  }
}

