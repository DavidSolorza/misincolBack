import { Injectable, Logger, Optional } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { InAppNotification, EmitNotificationDto } from '../domain/notification.types';
import { NotificationStorageService } from '../infrastructure/notification-storage.service';
import { MailTransportService } from '../infrastructure/mail-transport.service';
import { buildNotificationAlertEmailHtml } from '../infrastructure/templates/notification-alert.template';
import { buildCoordinatorTeamCreatedHtml } from '../infrastructure/templates/coordinator-team-created.template';
import { buildLeaderWelcomeCredentialsHtml } from '../infrastructure/templates/leader-welcome-credentials.template';
import { buildMemberWelcomeCredentialsHtml } from '../infrastructure/templates/member-welcome-credentials.template';
import { buildTeamDeletedHtml } from '../infrastructure/templates/team-deleted.template';

@Injectable()
export class NotificationDispatcherService {
  private readonly logger = new Logger(NotificationDispatcherService.name);

  constructor(
    private readonly storage: NotificationStorageService,
    @Optional() private readonly mailTransport?: MailTransportService,
  ) {}

  async dispatch(dto: EmitNotificationDto): Promise<InAppNotification> {
    const notification: InAppNotification = {
      id: randomUUID(), category: dto.category, severity: dto.severity || 'INFO',
      title: dto.title, message: dto.message, targetUserEmail: dto.targetUserEmail?.toLowerCase(),
      targetRole: dto.targetRole, teamId: dto.teamId, teamName: dto.teamName,
      isRead: false, metadata: dto.metadata || {}, createdAt: new Date().toISOString(),
    };
    await this.storage.append(notification);
    this.logger.log(`[NOTIFICACIÓN EMITIDA] [${notification.category}] ${notification.title}`);

    const targetEmail = notification.targetUserEmail || (
      (dto.category === 'SECURITY' || dto.severity === 'CRITICAL' || dto.sendEmail) ? (process.env.MAIL_USER || 'director@misincol.org') : undefined
    );
    if ((dto.sendEmail || dto.category === 'SECURITY' || dto.severity === 'CRITICAL') && targetEmail && this.mailTransport?.isConfigured()) {
      this.mailTransport.send({
        to: targetEmail, subject: `Misincol PDM [${notification.category}] - ${notification.title}`,
        html: buildNotificationAlertEmailHtml(notification),
      }).catch((e) => this.logger.warn(`Error enviando correo: ${e.message}`));
    }
    return notification;
  }

  async notifyTeamCreated(p: {
    teamName: string; ethnicity: string; location: string; leader: string;
    leaderEmail: string; accessPin: string; totalBudget: number;
    membersWithAccounts?: Array<{ fullName: string; email: string; roleInTeam?: string }>;
  }): Promise<void> {
    const adminEmail = process.env.MAIL_USER || 'director@misincol.org';
    if (this.mailTransport?.isConfigured()) {
      this.mailTransport.send({
        to: adminEmail, subject: `Misincol - Alta y Despliegue de Misión: ${p.teamName}`,
        html: buildCoordinatorTeamCreatedHtml(p),
      }).catch((e) => this.logger.warn(`Error enviando correo a coordinador: ${e.message}`));

      if (p.leaderEmail) {
        this.mailTransport.send({
          to: p.leaderEmail, subject: `Bienvenido a Misincol - Credenciales de Acceso: ${p.teamName}`,
          html: buildLeaderWelcomeCredentialsHtml(p),
        }).catch((e) => this.logger.warn(`Error enviando correo a líder: ${e.message}`));
      }

      if (p.membersWithAccounts && p.membersWithAccounts.length > 0) {
        for (const m of p.membersWithAccounts) {
          const mEmail = m.email?.trim().toLowerCase();
          if (mEmail && mEmail !== p.leaderEmail?.trim().toLowerCase()) {
            this.mailTransport.send({
              to: mEmail, subject: `Bienvenido(a) a Misincol - Credenciales de Integrante: ${p.teamName}`,
              html: buildMemberWelcomeCredentialsHtml({
                memberName: m.fullName, memberEmail: mEmail, memberRole: m.roleInTeam,
                teamName: p.teamName, ethnicity: p.ethnicity, location: p.location, accessPin: p.accessPin,
              }),
            }).catch((e) => this.logger.warn(`Error enviando correo a integrante ${mEmail}: ${e.message}`));
          }
        }
      }
    }
    await this.dispatch({
      category: 'SYSTEM', severity: 'INFO', title: `Despliegue Territorial: ${p.teamName}`,
      message: `Nueva misión ${p.teamName} creada bajo el liderazgo de ${p.leader}. Credenciales enviadas.`,
      teamName: p.teamName, sendEmail: false,
    });
  }

  async notifyTeamDeleted(p: { teamName: string; leaderName: string; deletedBy: string }): Promise<void> {
    const adminEmail = process.env.MAIL_USER || 'director@misincol.org';
    const deletedAt = new Date().toLocaleString('es-CO');
    if (this.mailTransport?.isConfigured()) {
      this.mailTransport.send({
        to: adminEmail, subject: `Misincol - Notificación de Baja Territorial: ${p.teamName}`,
        html: buildTeamDeletedHtml({ ...p, deletedAt }),
      }).catch((e) => this.logger.warn(`Error enviando correo de baja: ${e.message}`));
    }
    await this.dispatch({
      category: 'SECURITY', severity: 'WARNING', title: `Misión Eliminada: ${p.teamName}`,
      message: `La misión ${p.teamName} ha sido dada de baja del sistema por ${p.deletedBy}.`,
      teamName: p.teamName, sendEmail: false,
    });
  }

  async notifyRoleChange(p: { fullName: string; email: string; newRoleName: string; teamName?: string; performedBy?: string }): Promise<InAppNotification> {
    return this.dispatch({
      category: 'SECURITY', severity: 'WARNING', title: 'Actualización de Rol de Acceso',
      message: `El rol de "${p.fullName}" ha sido establecido en "${p.newRoleName}".`,
      targetUserEmail: p.email, teamName: p.teamName, sendEmail: true,
      metadata: { newRole: p.newRoleName, by: p.performedBy || 'Dirección Nacional' },
    });
  }

  async notifyNoteOrAgenda(p: { teamId: string; teamName: string; title: string; detail: string; targetEmail?: string; isImportant?: boolean }): Promise<InAppNotification> {
    return this.dispatch({
      category: 'NOTES_AGENDA', severity: p.isImportant ? 'WARNING' : 'INFO',
      title: `Nota / Agenda: ${p.title}`, message: p.detail, teamId: p.teamId, teamName: p.teamName,
      targetUserEmail: p.targetEmail, sendEmail: !!p.isImportant, metadata: { isImportant: !!p.isImportant },
    });
  }
}
