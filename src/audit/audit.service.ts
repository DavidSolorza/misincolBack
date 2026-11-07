import { Injectable } from '@nestjs/common';
import { AuditLog } from './entities/audit-log.entity';
import { QueryAuditDto } from './dto/query-audit.dto';

@Injectable()
export class AuditService {
  private logs: AuditLog[] = [
    {
      id: 'aud-seed-1',
      teamId: 'team-nasa',
      teamName: 'Misión Nasa - Tierradentro',
      userName: 'Aída Secue',
      userRole: 'ROLE_USUARIO',
      actionType: 'activity_update',
      title: 'Actualización de Estado de Actividad',
      detail: 'Cambio de estado en iniciativa territorial asignada',
      fieldModified: 'Estado de Actividad',
      previousValue: 'Pendiente',
      newValue: 'En Proceso',
      phaseId: 'phase-1',
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: 'aud-seed-2',
      teamId: 'team-nasa',
      teamName: 'Misión Nasa - Tierradentro',
      userName: 'Pr. Marcos Chocué',
      userRole: 'ROLE_LIDER',
      actionType: 'login',
      title: 'Inicio de Sesión Territorial',
      detail: 'Acceso exitoso al espacio de trabajo del equipo',
      timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
    {
      id: 'aud-seed-3',
      teamId: 'team-wayuu',
      teamName: 'Misión Wayúu - Alta Guajira',
      userName: 'Pr. David Morales',
      userRole: 'ROLE_LIDER',
      actionType: 'activity_update',
      title: 'Ajuste Presupuestal de Actividad',
      detail: 'Modificación de presupuesto anual en pozos de agua y evangelización',
      fieldModified: 'Presupuesto Total',
      previousValue: '$ 1.200.000',
      newValue: '$ 1.800.000',
      phaseId: 'phase-1',
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
    {
      id: 'aud-seed-4',
      teamId: 'team-pastos',
      teamName: 'Misión Pastos - Nariño',
      userName: 'Pr. Camilo Canticus',
      userRole: 'ROLE_LIDER',
      actionType: 'login',
      title: 'Inicio de Sesión Territorial',
      detail: 'Acceso autenticado desde territorio Nariño',
      timestamp: new Date(Date.now() - 3600000 * 28).toISOString(),
    },
    {
      id: 'aud-seed-5',
      teamId: 'team-wayuu',
      teamName: 'Misión Wayúu - Alta Guajira',
      userName: 'Coordinador Nacional',
      userRole: 'ROLE_NACIONAL',
      actionType: 'objective_update',
      title: 'Actualización de Meta Estratégica',
      detail: 'Revisión nacional de la meta de corto plazo',
      fieldModified: 'Meta Corto Plazo',
      previousValue: '2 visitas exploratorias',
      newValue: '4 visitas exploratorias a rancherías',
      phaseId: 'phase-1',
      timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
    },
  ];

  findAll(query?: QueryAuditDto): AuditLog[] {
    let result = [...this.logs];
    if (query?.teamId) result = result.filter((l) => l.teamId === query.teamId);
    if (query?.actionType) result = result.filter((l) => l.actionType === query.actionType);
    if (query?.userName) {
      const q = query.userName.toLowerCase();
      result = result.filter((l) => l.userName.toLowerCase().includes(q) || l.teamName.toLowerCase().includes(q));
    }
    return result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  findChanges(query?: QueryAuditDto): AuditLog[] {
    return this.findAll(query).filter((l) => l.actionType !== 'login' && l.previousValue !== undefined);
  }

  findLogins(query?: QueryAuditDto): AuditLog[] {
    return this.findAll(query).filter((l) => l.actionType === 'login');
  }

  recordLog(entry: Omit<AuditLog, 'id' | 'timestamp'>): AuditLog {
    const newLog: AuditLog = {
      ...entry,
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
    };
    this.logs.unshift(newLog);
    return newLog;
  }
}

