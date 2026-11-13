import { CriticalAlertEmailDto } from '../../domain/notification.types';

export function buildCriticalAlertEmailHtml(dto: CriticalAlertEmailDto): string {
  const badgeMap: Record<string, { bg: string; text: string; border: string }> = {
    Salud: { bg: '#fef2f2', text: '#991b1b', border: '#ef4444' },
    Seguridad: { bg: '#fff1f2', text: '#881337', border: '#f43f5e' },
    Logística: { bg: '#fffbeb', text: '#92400e', border: '#f59e0b' },
    Institucional: { bg: '#eff6ff', text: '#1e40af', border: '#3b82f6' },
  };
  const style = badgeMap[dto.alertType] || badgeMap.Logística;
  const appUrl = process.env.APP_URL || 'http://localhost:5173';

  return `
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8" /><title>Alerta Crítica</title></head>
      <body style="font-family: Arial, sans-serif; background-color: #fafaf9; margin: 0; padding: 24px; color: #1c1917;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 14px; overflow: hidden; border: 1px solid #e7e5e4;">
          <tr style="background-color: #b91c1c;">
            <td style="padding: 22px; text-align: center; color: #ffffff;">
              <h1 style="margin: 0; font-size: 19px; text-transform: uppercase; letter-spacing: 0.5px;">⚠️ Alerta Crítica Territorial</h1>
              <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.9;">Misincol • Red de Supervisión y Apoyo Inmediato</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 28px;">
              <div style="display: inline-block; background-color: ${style.bg}; color: ${style.text}; border: 1px solid ${style.border}; padding: 4px 12px; border-radius: 20px; font-weight: bold; font-size: 11px; text-transform: uppercase;">
                Categoría: ${dto.alertType}
              </div>
              <h2 style="margin: 14px 0 6px 0; color: #1c1917; font-size: 17px;">Misión: ${dto.teamName}</h2>
              <p style="font-size: 12px; color: #78716c; margin: 0 0 16px 0;">
                Reportado: ${dto.reportedAt} ${dto.leaderName ? `• Por: ${dto.leaderName}` : ''}
              </p>
              <div style="background-color: #fffbeb; border-left: 4px solid #b91c1c; padding: 14px 16px; border-radius: 6px; margin-bottom: 24px;">
                <p style="margin: 0; font-size: 13.5px; line-height: 1.5; color: #292524; font-style: italic;">
                  "${dto.message}"
                </p>
              </div>
              <div style="text-align: center; margin: 28px 0 12px 0;">
                <a href="${appUrl}" style="background-color: #b91c1c; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 13px; display: inline-block; box-shadow: 0 4px 12px rgba(185,28,28,0.25);">
                  👉 Ver en Panel de Supervisión Misincol
                </a>
              </div>
            </td>
          </tr>
          <tr style="background-color: #f5f5f4; border-top: 1px solid #e7e5e4;">
            <td style="padding: 14px; text-align: center; font-size: 11px; color: #78716c;">
              Este es un aviso automático de alta prioridad enviado a la Coordinación Nacional de Misincol.
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}
