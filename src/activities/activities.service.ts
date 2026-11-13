import { Injectable, ForbiddenException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Activity } from './entities/activity.entity';
import { CreateActivityDto, UpdateActivityDto } from './dto/create-activity.dto';
import { BaseInMemoryService } from '../common/services/base-in-memory.service';

@Injectable()
export class ActivitiesService extends BaseInMemoryService<Activity> {
  protected readonly entityName = 'Actividad';

  override findAll(objectiveId?: string): Activity[] {
    if (objectiveId) {
      return this.items.filter((act) => act.objectiveId === objectiveId);
    }
    return [...this.items];
  }

  findOne(id: string): Activity {
    return this.findById(id);
  }

  create(dto: CreateActivityDto, createdBy?: string, userRole?: string): Activity {
    if (userRole === 'ROLE_USUARIO') {
      throw new ForbiddenException('Los usuarios de equipo no tienen permisos para crear actividades.');
    }
    const unitBudget = Number(dto.unitBudget) || 0;
    const timesPerYear = Number(dto.timesPerYear) || 1;
    const totalBudget = this.calcBudget(unitBudget, timesPerYear, dto.monthlyBudget);

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
      monthlyBudget: dto.monthlyBudget,
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

    this.items.push(newActivity);
    return newActivity;
  }

  update(id: string, dto: UpdateActivityDto, updatedBy?: string, userRole?: string): Activity {
    if (userRole === 'ROLE_USUARIO') {
      throw new ForbiddenException('Los usuarios de equipo solo pueden actualizar el estado de sus actividades.');
    }
    const activity = this.findById(id);
    const unitBudget = dto.unitBudget !== undefined ? Number(dto.unitBudget) : activity.unitBudget;
    const timesPerYear = dto.timesPerYear !== undefined ? Number(dto.timesPerYear) : activity.timesPerYear;
    const monthlyBudget = dto.monthlyBudget !== undefined ? dto.monthlyBudget : activity.monthlyBudget;
    const totalBudget = this.calcBudget(unitBudget, timesPerYear, monthlyBudget);

    Object.assign(activity, dto, {
      unitBudget,
      timesPerYear,
      totalBudget,
      monthlyBudget,
      updatedBy: updatedBy || activity.updatedBy,
    });
    return activity;
  }

  updateStatus(id: string, status: string, userRole?: string, userName?: string): Activity {
    const activity = this.findById(id);
    if (userRole === 'ROLE_USUARIO') {
      const cleanResp = (activity.responsible || '').toLowerCase().trim();
      const cleanUser = (userName || '').toLowerCase().trim();
      if (!cleanResp || (!cleanResp.includes(cleanUser) && !cleanUser.includes(cleanResp))) {
        throw new ForbiddenException('Los usuarios de equipo solo pueden modificar el estado de sus actividades asignadas.');
      }
    }
    activity.status = status as 'Pendiente' | 'En Proceso' | 'Completado';
    activity.updatedBy = userName || activity.updatedBy;
    return activity;
  }

  delete(id: string, userRole?: string): { success: boolean; message: string } {
    if (userRole === 'ROLE_USUARIO') {
      throw new ForbiddenException('Los usuarios de equipo no tienen permisos para eliminar actividades.');
    }
    this.removeById(id);
    return { success: true, message: `Actividad ${id} eliminada exitosamente` };
  }

  private calcBudget(unit: number, times: number, monthly?: number[]): number {
    if (monthly && Array.isArray(monthly) && monthly.length > 0) {
      const sum = monthly.reduce((acc, m) => acc + (Number(m) || 0), 0);
      if (sum > 0) return sum;
    }
    return unit * times;
  }
}
