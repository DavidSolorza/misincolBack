import { Injectable } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';

@Injectable()
export class PlansService {
  private readonly activities: (CreateActivityDto & { id: string; totalBudget: number })[] = [];

  createActivity(dto: CreateActivityDto) {
    let totalBudget = dto.unitBudget * dto.timesPerYear;
    if (dto.monthlyBudget && Array.isArray(dto.monthlyBudget) && dto.monthlyBudget.length > 0) {
      const sum = dto.monthlyBudget.reduce((a, b) => a + (Number(b) || 0), 0);
      if (sum > 0) totalBudget = sum;
    }

    const newActivity = {
      ...dto,
      id: `act-${Date.now()}`,
      totalBudget,
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
