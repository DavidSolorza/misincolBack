import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PlansService } from './plans.service';
import { CreateActivityDto } from './dto/create-activity.dto';

@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Post('activities')
  createActivity(@Body() dto: CreateActivityDto) {
    return this.plansService.createActivity(dto);
  }

  @Get('activities')
  getAllActivities() {
    return this.plansService.findAllActivities();
  }

  @Get('activities/pillar/:pillar')
  getByPillar(@Param('pillar') pillar: string) {
    return this.plansService.findByPillar(pillar);
  }
}
