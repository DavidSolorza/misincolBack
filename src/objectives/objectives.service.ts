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
    },
  ];

  findAll(): Objective[] { return this.objectives; }

  findByTeamAndPillar(teamId: string, pillarId: string): Objective[] {
    return this.objectives
      .filter((o) => o.teamId === teamId && o.pillarId.toLowerCase() === pillarId.toLowerCase())
      .sort((a, b) => a.dynamicPosition - b.dynamicPosition);
  }

  create(dto: CreateObjectiveDto): Objective {
    const existing = this.findByTeamAndPillar(dto.teamId, dto.pillarId);
    if (existing.length >= 4) {
      throw new BadRequestException('Regla Ministerial: Toda fase admite como máximo 4 objetivos estratégicos.');
    }

    const nextPosition = existing.length + 1;
    const newObjective: Objective = {
      id: `obj-${Date.now()}`,
      dynamicPosition: nextPosition,
      ...dto,
    };
    this.objectives.push(newObjective);
    return newObjective;
  }

  update(id: string, dto: UpdateObjectiveDto): Objective {
    const obj = this.objectives.find((o) => o.id === id);
    if (!obj) throw new NotFoundException(`Objetivo '${id}' no encontrado.`);

    Object.assign(obj, dto);
    return obj;
  }

  delete(id: string): { deletedId: string; reordered: Objective[] } {
    const target = this.objectives.find((o) => o.id === id);
    if (!target) throw new NotFoundException(`Objetivo '${id}' no encontrado.`);

    const siblings = this.findByTeamAndPillar(target.teamId, target.pillarId);
    if (siblings.length <= 1) {
      throw new BadRequestException('No se puede eliminar: Toda fase ministerial debe contar con al menos un objetivo.');
    }

    this.objectives = this.objectives.filter((o) => o.id !== id);

    // Autoenumeración dinámica secuencial
    const remaining = this.findByTeamAndPillar(target.teamId, target.pillarId);
    remaining.forEach((o, index) => {
      o.dynamicPosition = index + 1;
    });

    return { deletedId: id, reordered: remaining };
  }
}
