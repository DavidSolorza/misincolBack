import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
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
  create(@Body() dto: CreateActivityDto, @Req() req: any): Activity {
    const creator = req.user?.email || 'Líder';
    return this.activitiesService.create(dto, creator);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateActivityDto, @Req() req: any): Activity {
    const updater = req.user?.email || 'Líder';
    return this.activitiesService.update(id, dto, updater);
  }

  @Delete(':id')
  delete(@Param('id') id: string): { success: boolean; message: string } {
    return this.activitiesService.delete(id);
  }
}
