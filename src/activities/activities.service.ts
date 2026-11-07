import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
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

  create(dto: CreateActivityDto, createdBy?: string, userRole?: string): Activity {
    if (userRole === 'ROLE_USUARIO') {
      throw new ForbiddenException('Los usuarios de equipo no tienen permisos para crear actividades.');
    }
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

  update(id: string, dto: UpdateActivityDto, updatedBy?: string, userRole?: string): Activity {
    if (userRole === 'ROLE_USUARIO') {
      throw new ForbiddenException('Los usuarios de equipo solo pueden actualizar el estado de sus actividades.');
    }
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

  updateStatus(id: string, status: string, userRole?: string, userName?: string): Activity {
    const activity = this.findOne(id);
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
    const initialLength = this.activities.length;
    this.activities = this.activities.filter((act) => act.id !== id);
    if (this.activities.length === initialLength) {
      throw new NotFoundException(`Actividad con ID ${id} no encontrada`);
    }
    return { success: true, message: `Actividad ${id} eliminada exitosamente` };
  }
}
