import { describe, it, expect, beforeEach } from 'vitest';
import { MailTransportService } from './mail-transport.service';
import { buildTeamWelcomeEmailHtml } from './templates/welcome-team.template';
import { buildCriticalAlertEmailHtml } from './templates/critical-alert.template';

describe('MailTransportService (Google Notifications & Simulation Mode)', () => {
  let service: MailTransportService;

  beforeEach(() => {
    delete process.env.MAIL_USER;
    delete process.env.MAIL_PASS;
    service = new MailTransportService();
  });

  it('debe iniciar en modo simulación seguro cuando no hay variables de entorno', async () => {
    expect(service.isConfigured()).toBe(false);
    expect(service.getConfiguredUser()).toBeNull();

    const result = await service.send({
      to: 'pastor@misincol.org',
      subject: 'Bienvenida a la Misión',
      html: '<p>Hola</p>',
    });

    expect(result.success).toBe(true);
    expect(result.simulated).toBe(true);
    expect(result.messageId).toBeDefined();
  });

  it('debe generar correctamente la plantilla HTML de bienvenida ministerial', () => {
    const html = buildTeamWelcomeEmailHtml({
      teamName: 'Misión Pastos',
      leaderName: 'Pr. Hugo',
      leaderEmail: 'pastos@misincol.org',
      accessPin: 'pastos2026',
      members: [{ fullName: 'Marta', email: 'marta@misincol.org', roleInTeam: 'Salud' }],
    });

    expect(html).toContain('Misión Pastos');
    expect(html).toContain('pastos2026');
    expect(html).toContain('pastos@misincol.org');
    expect(html).toContain('Marta');
  });

  it('debe generar la plantilla HTML de alerta crítica con badge de categoría', () => {
    const html = buildCriticalAlertEmailHtml({
      teamName: 'Misión Wayúu',
      alertType: 'Salud',
      message: 'Brote de desnutrición en ranchería norte',
      reportedAt: '11 de Noviembre 2026',
      leaderName: 'Pr. David Morales',
      recipientEmails: ['director@misincol.org'],
    });

    expect(html).toContain('Salud');
    expect(html).toContain('Misión Wayúu');
    expect(html).toContain('Brote de desnutrición en ranchería norte');
  });
});

