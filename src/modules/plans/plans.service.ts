import { Injectable } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';

@Injectable()
export class PlansService {
  private readonly activities: (CreateActivityDto & { id: string; totalBudget: number })[] = [];

  createActivity(dto: CreateActivityDto) {
    const newActivity = {
      ...dto,
      id: `act-${Date.now()}`,
      totalBudget: dto.unitBudget * dto.timesPerYear,
    };
    this.activities.push(newActivity);
    return newActivity;
  }

  findAllActivities() {
    return this.activities;
  }

  findByPillar(pillar: string) {
    return this.activities.filter((a) => a.essentialArea.toLowerCase() === pillar.toLowerCase());
  }
}
