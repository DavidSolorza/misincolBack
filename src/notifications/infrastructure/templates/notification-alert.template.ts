import { InAppNotification } from '../../domain/notification.types';

export function buildNotificationAlertEmailHtml(notif: InAppNotification): string {
  const categoryLabels: Record<string, string> = {
    SECURITY: 'Seguridad y Roles',
    NOTES_AGENDA: 'Notas y Agenda Territorial',
    PDM_CRITICAL: 'Alerta Crítica PDM',
    SYSTEM: 'Aviso del Sistema',
  };

  const categoryColors: Record<string, string> = {
    SECURITY: '#b91c1c',
    NOTES_AGENDA: '#1d4ed8',
    PDM_CRITICAL: '#d97706',
    SYSTEM: '#44403c',
  };

  const categoryName = categoryLabels[notif.category] || 'Notificación';
  const headerColor = categoryColors[notif.category] || '#8B251E';
  const portalUrl = process.env.APP_URL || 'http://localhost:5173';

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${notif.title}</title>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #fafaf9; margin: 0; padding: 24px; color: #1c1917;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e7e5e4;">
          <tr style="background-color: #8B251E;">
            <td style="padding: 22px; text-align: center; color: #ffffff;">
              <h1 style="margin: 0; font-size: 20px; letter-spacing: 1.5px;">MISINCOL</h1>
              <p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.9;">Plan de Desarrollo Ministerial</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 28px;">
              <div style="display: inline-block; padding: 5px 12px; border-radius: 6px; background-color: #f5f5f4; border: 1px solid #e7e5e4; font-size: 11px; font-weight: bold; color: ${headerColor}; text-transform: uppercase; margin-bottom: 14px;">
                ${categoryName}
              </div>
              <h2 style="margin: 0 0 14px 0; color: #1c1917; font-size: 18px; font-weight: bold;">
                ${notif.title}
              </h2>
              <div style="background-color: #fbf9f6; border-left: 4px solid ${headerColor}; padding: 16px; border-radius: 6px; margin-bottom: 22px;">
                <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #44403c;">
                  ${notif.message}
                </p>
                ${notif.teamName ? `<p style="margin: 10px 0 0 0; font-size: 12px; color: #78716c;"><strong>Misión / Territorio:</strong> ${notif.teamName}</p>` : ''}
              </div>

              <!-- BOTÓN PRINCIPAL DE ACCESO -->
              <div style="margin: 28px 0; text-align: center;">
                <a href="${portalUrl}" style="background-color: #8B251E; color: #ffffff !important; text-decoration: none; padding: 14px 28px; font-size: 13.5px; font-weight: bold; border-radius: 10px; display: inline-block; box-shadow: 0 4px 12px rgba(139, 37, 30, 0.25); text-transform: uppercase; letter-spacing: 0.5px;">
                  👉 Ingresar a la Plataforma Misincol
                </a>
              </div>

              <p style="font-size: 11px; color: #a8a29e; margin: 24px 0 0 0; border-top: 1px solid #f5f5f4; padding-top: 14px; text-align: center;">
                Notificación automática de alta prioridad emitida por la Coordinación Nacional de Misincol el ${new Date(notif.createdAt).toLocaleString()}.
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}
