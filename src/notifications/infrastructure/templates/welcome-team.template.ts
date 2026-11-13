import { TeamWelcomeEmailDto } from '../../domain/notification.types';

export function buildTeamWelcomeEmailHtml(dto: TeamWelcomeEmailDto): string {
  const portalUrl = dto.portalUrl || process.env.APP_URL || 'http://localhost:5173';
  const membersListHtml = dto.members && dto.members.length > 0
    ? `
      <div style="margin-top: 16px; padding: 12px; background-color: #f5f5f4; border-radius: 8px;">
        <h4 style="margin: 0 0 8px 0; color: #44403c; font-size: 13px; text-transform: uppercase;">Integrantes del Equipo Asignados</h4>
        <ul style="margin: 0; padding-left: 18px; color: #57534e; font-size: 13px; line-height: 1.6;">
          ${dto.members.map((m) => `<li><strong>${m.fullName}</strong> (${m.email}) - <em>${m.roleInTeam || 'Misionero'}</em></li>`).join('')}
        </ul>
      </div>
    `
    : '';

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Bienvenido a Misincol</title>
      </head>
      <body style="font-family: Arial, sans-serif; background-color: #fafaf9; margin: 0; padding: 24px; color: #1c1917;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e7e5e4;">
          <tr style="background-color: #8B251E;">
            <td style="padding: 24px; text-align: center; color: #ffffff;">
              <h1 style="margin: 0; font-size: 20px; letter-spacing: 1.5px;">MISINCOL</h1>
              <p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.9;">Plan de Desarrollo Ministerial</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 28px;">
              <h2 style="margin: 0 0 12px 0; color: #292524; font-size: 18px;">
                ¡Bienvenido a la ${dto.teamName}!
              </h2>
              <p style="font-size: 14px; line-height: 1.5; color: #57534e; margin: 0 0 16px 0;">
                Estimado(a) <strong>${dto.leaderName}</strong>, se ha configurado exitosamente el despliegue ministerial de tu equipo en la plataforma nacional.
              </p>

              <div style="background-color: #fef2f2; border-left: 4px solid #8B251E; padding: 14px; border-radius: 6px; margin-bottom: 16px;">
                <h3 style="margin: 0 0 8px 0; font-size: 14px; color: #991b1b;">Credenciales de Acceso</h3>
                <p style="margin: 4px 0; font-size: 13px;"><strong>Usuario / Correo:</strong> ${dto.leaderEmail}</p>
                <p style="margin: 4px 0; font-size: 13px;"><strong>Contraseña del Equipo (PIN):</strong> <code style="background: #fee2e2; padding: 2px 6px; border-radius: 4px; font-weight: bold;">${dto.accessPin}</code></p>
                <p style="margin: 6px 0 0 0; font-size: 11px; color: #7f1d1d;">
                  * Todos los integrantes de este equipo ingresan con su propio correo institucional y esta misma contraseña compartida.
                </p>
              </div>

              ${membersListHtml}

              <!-- BOTÓN PRINCIPAL DE ACCESO -->
              <div style="margin: 28px 0; text-align: center;">
                <a href="${portalUrl}" style="background-color: #8B251E; color: #ffffff !important; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 13.5px; display: inline-block; box-shadow: 0 4px 12px rgba(139, 37, 30, 0.25); text-transform: uppercase; letter-spacing: 0.5px;">
                  👉 Ingresar a la Plataforma Misincol
                </a>
              </div>
            </td>
          </tr>
          <tr style="background-color: #f5f5f4; border-top: 1px solid #e7e5e4;">
            <td style="padding: 16px; text-align: center; font-size: 11px; color: #78716c;">
              Misincol • Coordinación Nacional de Misiones Territoriales • Colombia
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}
