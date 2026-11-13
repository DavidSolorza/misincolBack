import { describe, it, expect, beforeEach } from 'vitest';
import { NotificationsService } from './notifications.service';
import { NotificationStorageService } from './infrastructure/notification-storage.service';
import { NotificationDispatcherService } from './application/notification-dispatcher.service';
import { MailTransportService } from './infrastructure/mail-transport.service';

describe('NotificationsService (Layered Notification & Delivery Tests)', () => {
  let service: NotificationsService;
  let transport: MailTransportService;
  let storage: NotificationStorageService;
  let dispatcher: NotificationDispatcherService;

  beforeEach(async () => {
    delete process.env.MAIL_USER;
    delete process.env.MAIL_PASS;
    transport = new MailTransportService();
    storage = new NotificationStorageService();
    await storage.onModuleInit();
    dispatcher = new NotificationDispatcherService(storage, transport);
    const mockActivities: any = { findAll: () => [] };
    const mockReports: any = { findAll: () => [] };
    const mockTeams: any = { findAll: () => [] };
    service = new NotificationsService(mockActivities, mockReports, mockTeams, storage, dispatcher, transport);
  });

  it('debe emitir notificación de cambio de rol y listar en bandeja', async () => {
    const notif = await service.emitNotification({
      category: 'SECURITY',
      severity: 'WARNING',
      title: 'Cambio de Rol Pastoral',
      message: 'Se ha asignado el rol Coordinador a Hugo',
      targetUserEmail: 'hugo@misincol.org',
    });

    expect(notif.id).toBeDefined();
    expect(notif.category).toBe('SECURITY');
    expect(notif.isRead).toBe(false);

    const res = await service.getNotifications({ email: 'hugo@misincol.org' });
    expect(res.list.length).toBeGreaterThanOrEqual(1);
    expect(res.unreadCount).toBeGreaterThanOrEqual(1);
  });

  it('debe emitir notificación de nota y agenda territorial', async () => {
    const notif = await service.emitNotification({
      category: 'NOTES_AGENDA',
      severity: 'INFO',
      title: 'Nota de Misión Cumbal',
      message: 'Motivo de oración por familias locales',
      teamId: 'team-pastos',
    });

    expect(notif.category).toBe('NOTES_AGENDA');
    const res = await service.getNotifications({ teamId: 'team-pastos' });
    expect(res.list.some((n) => n.id === notif.id)).toBe(true);
  });

  it('debe marcar una notificación individual y todas como leídas', async () => {
    const notif = await service.emitNotification({
      category: 'SYSTEM',
      title: 'Alerta del Sistema',
      message: 'Mantenimiento preventivo',
    });

    expect(notif.isRead).toBe(false);
    const marked = await service.markAsRead(notif.id);
    expect(marked).toBe(true);

    const count = await service.markAllAsRead();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  it('debe despachar correo de bienvenida al equipo en modo seguro', async () => {
    const result = await service.sendTeamWelcomeEmail({
      teamName: 'Misión Embera',
      leaderName: 'Pr. Arias',
      leaderEmail: 'arias@misincol.org',
      accessPin: 'embera2026',
    });
    expect(result.success).toBe(true);
    expect(result.simulated).toBe(true);
  });
});
