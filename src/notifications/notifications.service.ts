import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { randomUUID } from 'crypto';
import { ActivitiesService } from '../activities/activities.service';
import { ReportsService } from '../reports/reports.service';
import { TeamsService } from '../teams/teams.service';
import { NotificationEntity } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private notifications: NotificationEntity[] = [];

  constructor(
    private readonly activitiesService: ActivitiesService,
    private readonly reportsService: ReportsService,
    private readonly teamsService: TeamsService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  handleScheduledAudit() {
    this.logger.log('Iniciando auditoría programada de fechas límite y reportes...');
    return this.runAudit();
  }

  runAudit(): { generated: number; alerts: NotificationEntity[] } {
    const alerts: NotificationEntity[] = [];
    const activities = this.activitiesService.findAll();
    const now = new Date();
    const directorEmail = 'director@misincol.org';

    for (const act of activities) {
      if (act.status !== 'Completado' && act.endDate) {
        const end = new Date(act.endDate);
        const diffDays = Math.ceil((end.getTime() - now.getTime()) / (1000 * 3600 * 24));

        if (diffDays <= 7) {
          const isOverdue = diffDays < 0;
          const recipients = [act.responsible, directorEmail];
          const alert: NotificationEntity = {
            id: randomUUID(),
            type: 'DEADLINE',
            title: isOverdue ? 'Actividad Vencida' : 'Actividad Próxima a Vencer',
            message: `La actividad "${act.description}" a cargo de ${act.responsible} ${
              isOverdue ? `venció hace ${Math.abs(diffDays)} días` : `vence en ${diffDays} días`
            }.`,
            recipients,
            activityId: act.id,
            status: 'SENT',
            createdAt: new Date().toISOString(),
          };
          alerts.push(alert);
          this.notifications.push(alert);
          this.logger.warn(`[NOTIFICACIÓN] ${alert.title}: ${alert.message} -> Enviado a: ${recipients.join(', ')}`);
        }
      }
    }

    const teams = this.teamsService.findAll();
    const currentYear = now.getFullYear();
    for (const t of teams) {
      const reports = this.reportsService.findAll(t.id);
      const hasCurrent = reports.some((r) => r.year === currentYear);
      if (!hasCurrent) {
        const recipients = [t.leaderPhone || t.name, directorEmail];
        const missingAlert: NotificationEntity = {
          id: randomUUID(),
          type: 'MISSING_REPORT',
          title: 'Reporte de Campo Pendiente',
          message: `El equipo territorial "${t.name}" no ha registrado el reporte de campo del año ${currentYear}.`,
          recipients,
          teamId: t.id,
          status: 'SENT',
          createdAt: new Date().toISOString(),
        };
        alerts.push(missingAlert);
        this.notifications.push(missingAlert);
        this.logger.warn(`[NOTIFICACIÓN] ${missingAlert.title}: ${missingAlert.message}`);
      }
    }

    return { generated: alerts.length, alerts };
  }

  findAll(recipientOrTeam?: string): NotificationEntity[] {
    if (!recipientOrTeam) return [...this.notifications];
    return this.notifications.filter(
      (n) =>
        n.teamId === recipientOrTeam ||
        n.recipients.some((r) => r.toLowerCase().includes(recipientOrTeam.toLowerCase())),
    );
  }
}

