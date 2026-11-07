import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
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
    const creator = req.user?.fullName || req.user?.email || 'Líder';
    return this.activitiesService.create(dto, creator, req.user?.role);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateActivityDto, @Req() req: any): Activity {
    const updater = req.user?.fullName || req.user?.email || 'Líder';
    return this.activitiesService.update(id, dto, updater, req.user?.role);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Req() req: any,
  ): Activity {
    const userRole = req.user?.role;
    const userName = req.user?.fullName || req.user?.userName || req.user?.email;
    return this.activitiesService.updateStatus(id, status, userRole, userName);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Req() req: any): { success: boolean; message: string } {
    return this.activitiesService.delete(id, req.user?.role);
  }
}
