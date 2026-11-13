import { Injectable, Logger, Optional, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ActivitiesService } from '../activities/activities.service';
import { ReportsService } from '../reports/reports.service';
import { TeamsService } from '../teams/teams.service';
import { InAppNotification, EmitNotificationDto, TeamWelcomeEmailDto, CriticalAlertEmailDto } from './domain/notification.types';
import { NotificationStorageService } from './infrastructure/notification-storage.service';
import { NotificationDispatcherService } from './application/notification-dispatcher.service';
import { MailTransportService } from './infrastructure/mail-transport.service';
import { buildTeamWelcomeEmailHtml } from './infrastructure/templates/welcome-team.template';
import { buildCriticalAlertEmailHtml } from './infrastructure/templates/critical-alert.template';

@Injectable()
export class NotificationsService implements OnModuleInit {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private readonly activitiesService: ActivitiesService,
    private readonly reportsService: ReportsService,
    private readonly teamsService: TeamsService,
    private readonly storage: NotificationStorageService,
    private readonly dispatcher: NotificationDispatcherService,
    @Optional() private readonly mailTransport?: MailTransportService,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.storage.onModuleInit();
  }

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  handleScheduledAudit() {
    this.logger.log('Iniciando auditoría programada de fechas límite y reportes...');
    return this.runAudit();
  }

  async runAudit(): Promise<{ generated: number; alerts: InAppNotification[] }> {
    const alerts: InAppNotification[] = [];
    const activities = this.activitiesService.findAll();
    const now = new Date();

    for (const act of activities) {
      if (act.status !== 'Completado' && act.endDate) {
        const end = new Date(act.endDate);
        const diffDays = Math.ceil((end.getTime() - now.getTime()) / (1000 * 3600 * 24));
        if (diffDays <= 7) {
          const isOverdue = diffDays < 0;
          const notif = await this.dispatcher.dispatch({
            category: 'PDM_CRITICAL',
            severity: isOverdue ? 'CRITICAL' : 'WARNING',
            title: isOverdue ? 'Actividad Vencida' : 'Actividad Próxima a Vencer',
            message: `La actividad "${act.description}" a cargo de ${act.responsible} ${isOverdue ? `venció hace ${Math.abs(diffDays)} días` : `vence en ${diffDays} días`}.`,
            targetUserEmail: act.responsible,
          });
          alerts.push(notif);
        }
      }
    }
    return { generated: alerts.length, alerts };
  }

  async getNotifications(filter?: { email?: string; teamId?: string }) {
    const list = await this.storage.getAll();
    const filtered = !filter ? list : list.filter((n) => {
      const matchEmail = !filter.email || !n.targetUserEmail || n.targetUserEmail.toLowerCase() === filter.email.toLowerCase();
      const matchTeam = !filter.teamId || !n.teamId || n.teamId === filter.teamId;
      return matchEmail && matchTeam;
    });
    return { list: filtered, unreadCount: filtered.filter((n) => !n.isRead).length };
  }

  async markAsRead(id: string) {
    return this.storage.markAsRead(id);
  }

  async markAllAsRead(filter?: { email?: string; teamId?: string }) {
    return this.storage.markAllAsRead(filter);
  }

  async emitNotification(dto: EmitNotificationDto) {
    return this.dispatcher.dispatch(dto);
  }

  async notifyTeamCreated(p: {
    teamName: string; ethnicity: string; location: string; leader: string;
    leaderEmail: string; accessPin: string; totalBudget: number;
    membersWithAccounts?: Array<{ fullName: string; email: string; roleInTeam?: string }>;
  }) {
    return this.dispatcher.notifyTeamCreated(p);
  }

  async notifyTeamDeleted(p: { teamName: string; leaderName: string; deletedBy: string }) {
    return this.dispatcher.notifyTeamDeleted(p);
  }

  getMailStatus() {
    return {
      configured: this.mailTransport?.isConfigured() || false,
      user: this.mailTransport?.getConfiguredUser() || null,
      mode: this.mailTransport?.isConfigured() ? 'GOOGLE_SMTP_ACTIVO' : 'SIMULACION_SEGURA',
    };
  }

  async sendTestEmail(to: string) {
    if (!this.mailTransport) return { success: false, error: 'Transporte de correo no disponible' };
    return this.mailTransport.send({ to, subject: 'Misincol PDM - Verificación de Notificaciones Google', html: '<p>Correo de prueba verificado.</p>' });
  }

  async sendTeamWelcomeEmail(dto: TeamWelcomeEmailDto) {
    if (!this.mailTransport) return { success: false, error: 'Transporte de correo no disponible' };
    const html = buildTeamWelcomeEmailHtml(dto);
    const recipients = [dto.leaderEmail];
    if (dto.members) dto.members.forEach((m) => { if (m.email && !recipients.includes(m.email)) recipients.push(m.email); });
    return this.mailTransport.send({ to: recipients, subject: `Misincol - Despliegue Ministerial: ${dto.teamName}`, html });
  }

  async sendCriticalAlertEmail(dto: CriticalAlertEmailDto) {
    if (!this.mailTransport) return { success: false, error: 'Transporte de correo no disponible' };
    const html = buildCriticalAlertEmailHtml(dto);
    return this.mailTransport.send({ to: dto.recipientEmails, subject: `⚠️ ALERTA CRÍTICA [${dto.alertType}]: ${dto.teamName}`, html });
  }
}
