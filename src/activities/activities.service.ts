import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Activity } from './entities/activity.entity';
import { CreateActivityDto, UpdateActivityDto } from './dto/create-activity.dto';

@Injectable()
export class ActivitiesService {
  private activities: Activity[] = [];

  findAll(objectiveId?: string): Activity[] {
    if (objectiveId) {
      return this.activities.filter((act) => act.objectiveId === objectiveId);
    }
    return [...this.activities];
  }

  findOne(id: string): Activity {
    const activity = this.activities.find((act) => act.id === id);
    if (!activity) {
      throw new NotFoundException(`Actividad con ID ${id} no encontrada`);
    }
    return activity;
  }

  create(dto: CreateActivityDto, createdBy?: string): Activity {
    const unitBudget = Number(dto.unitBudget) || 0;
    const timesPerYear = Number(dto.timesPerYear) || 1;
    const totalBudget = unitBudget * timesPerYear;

    const newActivity: Activity = {
      id: randomUUID(),
      objectiveId: dto.objectiveId,
      description: dto.description,
      status: dto.status || 'Pendiente',
      essentialArea: dto.essentialArea,
      stage: dto.stage,
      areaLevel: dto.areaLevel,
      unitBudget,
      timesPerYear,
      totalBudget,
      frequency: dto.frequency || 'Anual',
      startDate: dto.startDate,
      endDate: dto.endDate,
      responsible: dto.responsible,
      currentSituation: dto.currentSituation,
      shortTermGoal: dto.shortTermGoal,
      mediumTermGoal: dto.mediumTermGoal,
      longTermGoal: dto.longTermGoal,
      createdBy: createdBy || 'Líder',
      updatedBy: createdBy || 'Líder',
    };

    this.activities.push(newActivity);
    return newActivity;
  }

  update(id: string, dto: UpdateActivityDto, updatedBy?: string): Activity {
    const activity = this.findOne(id);
    const unitBudget = dto.unitBudget !== undefined ? Number(dto.unitBudget) : activity.unitBudget;
    const timesPerYear = dto.timesPerYear !== undefined ? Number(dto.timesPerYear) : activity.timesPerYear;
    const totalBudget = unitBudget * timesPerYear;

    Object.assign(activity, dto, {
      unitBudget,
      timesPerYear,
      totalBudget,
      updatedBy: updatedBy || activity.updatedBy,
    });
    return activity;
  }

  delete(id: string): { success: boolean; message: string } {
    const initialLength = this.activities.length;
    this.activities = this.activities.filter((act) => act.id !== id);
    if (this.activities.length === initialLength) {
      throw new NotFoundException(`Actividad con ID ${id} no encontrada`);
    }
    return { success: true, message: `Actividad ${id} eliminada exitosamente` };
  }
}
