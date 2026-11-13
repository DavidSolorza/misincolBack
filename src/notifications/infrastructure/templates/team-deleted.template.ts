// Plantilla HTML: Notificación de eliminación o baja de misión territorial
export interface TeamDeletedEmailDto {
  teamName: string;
  leaderName: string;
  deletedBy: string;
  deletedAt: string;
}

export function buildTeamDeletedHtml(dto: TeamDeletedEmailDto): string {
  const appUrl = process.env.APP_URL || 'http://localhost:5173';

  return `
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8" /><title>Baja de Misión Territorial</title></head>
      <body style="font-family: Arial, sans-serif; background-color: #fafaf9; margin: 0; padding: 24px; color: #1c1917;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 14px; overflow: hidden; border: 1px solid #e7e5e4;">
          <tr style="background-color: #7f1d1d;">
            <td style="padding: 22px; text-align: center; color: #ffffff;">
              <span style="display: inline-block; background-color: #ef4444; color: #ffffff; font-size: 10px; font-weight: bold; padding: 3px 10px; border-radius: 20px; text-transform: uppercase;">Auditoría de Seguridad</span>
              <h1 style="margin: 8px 0 0 0; font-size: 18px;">Misión Territorial Eliminada</h1>
              <p style="margin: 4px 0 0 0; font-size: 12px; color: #fecaca;">Misincol • Registro Oficial de Cambios</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 26px;">
              <p style="margin: 0 0 14px 0; font-size: 13.5px; line-height: 1.5; color: #292524;">
                Se ha registrado la baja y remoción de la siguiente misión territorial en la plataforma nacional:
              </p>
              <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 6px; padding: 14px 16px; margin-bottom: 22px;">
                <p style="margin: 0 0 6px 0; font-size: 13px;"><strong>Misión:</strong> ${dto.teamName}</p>
                <p style="margin: 0 0 6px 0; font-size: 13px;"><strong>Líder Anterior:</strong> ${dto.leaderName}</p>
                <p style="margin: 0 0 6px 0; font-size: 13px;"><strong>Ejecutado Por:</strong> ${dto.deletedBy}</p>
                <p style="margin: 0; font-size: 13px;"><strong>Fecha / Hora:</strong> ${dto.deletedAt}</p>
              </div>
              <div style="text-align: center; margin: 24px 0 10px 0;">
                <a href="${appUrl}" style="background-color: #1c1917; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 12.5px; display: inline-block;">
                  👉 Ir al Tablero de Supervisión
                </a>
              </div>
            </td>
          </tr>
          <tr style="background-color: #f5f5f4; border-top: 1px solid #e7e5e4;">
            <td style="padding: 14px; text-align: center; font-size: 11px; color: #78716c;">
              Registro de seguridad inmutable generado para la Coordinación Nacional Misincol.
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

