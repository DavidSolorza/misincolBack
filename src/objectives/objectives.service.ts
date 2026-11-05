import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Objective } from './entities/objective.entity';
import { CreateObjectiveDto, UpdateObjectiveDto } from './dto/create-objective.dto';

@Injectable()
export class ObjectivesService {
  private objectives: Objective[] = [
    {
      id: 'obj-wayuu-inv-1',
      teamId: 'team-wayuu',
      pillarId: 'investigacion',
      dynamicPosition: 1,
      title: 'Diagnóstico Socio-Espiritual de Comunidades y Castas',
      description: 'Mapeo territorial y caracterización etnográfica en la Alta Guajira.',
      essentialArea: 'Investigación',
      level: 'Nivel 1',
      stage: 'Contacto primeros oyentes',
      mediumTermGoal: '10 comunidades cartografiadas',
      longTermGoal: 'Censo de clanes y autoridades tradicionales',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'obj-wayuu-inv-2',
      teamId: 'team-wayuu',
      pillarId: 'investigacion',
      dynamicPosition: 2,
      title: 'Inmersión Lingüística y Cosmovisión Wayuu',
      description: 'Estudio de narrativas orales y dialectos wayuunaiki.',
      essentialArea: 'Investigación',
      level: 'Nivel 2',
      stage: 'Contacto primeros oyentes',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  findAll(): Objective[] { return this.objectives; }

  findByTeamAndPillar(teamId: string, pillarId: string): Objective[] {
    return this.objectives
      .filter((o) => o.teamId === teamId && o.pillarId.toLowerCase() === pillarId.toLowerCase())
      .sort((a, b) => a.dynamicPosition - b.dynamicPosition);
  }

  create(dto: CreateObjectiveDto, createdBy?: string): Objective {
    const existing = this.findByTeamAndPillar(dto.teamId, dto.pillarId);
    if (existing.length >= 4) {
      throw new BadRequestException('Regla Ministerial: Toda fase admite como máximo 4 objetivos estratégicos.');
    }

    const nextPosition = existing.length + 1;
    const now = new Date().toISOString();
    const newObjective: Objective = {
      id: `obj-${Date.now()}`,
      teamId: dto.teamId,
      pillarId: dto.pillarId.toLowerCase(),
      dynamicPosition: nextPosition,
      title: dto.title,
      description: dto.description,
      essentialArea: dto.essentialArea,
      level: dto.level,
      stage: dto.stage,
      mediumTermGoal: dto.mediumTermGoal,
      longTermGoal: dto.longTermGoal,
      totalBudget: dto.totalBudget || 0,
      createdAt: now,
      updatedAt: now,
      createdBy: createdBy || 'Líder',
      updatedBy: createdBy || 'Líder',
    };

    this.objectives.push(newObjective);
    return newObjective;
  }

  update(id: string, dto: UpdateObjectiveDto, updatedBy?: string): Objective {
    const obj = this.objectives.find((o) => o.id === id);
    if (!obj) throw new NotFoundException(`Objetivo ${id} no encontrado`);
    Object.assign(obj, dto, { updatedAt: new Date().toISOString(), updatedBy });
    return obj;
  }

  delete(id: string): { success: boolean; message: string } {
    const target = this.objectives.find((o) => o.id === id);
    if (!target) throw new NotFoundException(`Objetivo ${id} no encontrado`);

    const { teamId, pillarId } = target;
    this.objectives = this.objectives.filter((o) => o.id !== id);
    this.recalculatePositions(teamId, pillarId);

    return { success: true, message: `Objetivo ${id} eliminado y numeración recalculada.` };
  }

  private recalculatePositions(teamId: string, pillarId: string): void {
    const remaining = this.objectives
      .filter((o) => o.teamId === teamId && o.pillarId.toLowerCase() === pillarId.toLowerCase())
      .sort((a, b) => a.dynamicPosition - b.dynamicPosition);

    remaining.forEach((obj, idx) => {
      obj.dynamicPosition = idx + 1;
      obj.updatedAt = new Date().toISOString();
    });
  }
}
