// Plantilla HTML: Notificación formal de alta de equipo al Coordinador de Equipos
export interface CoordinatorTeamCreatedEmailDto {
  teamName: string;
  ethnicity: string;
  location: string;
  leader: string;
  leaderEmail: string;
  accessPin: string;
  totalBudget: number;
}

export function buildCoordinatorTeamCreatedHtml(dto: CoordinatorTeamCreatedEmailDto): string {
  const appUrl = process.env.APP_URL || 'http://localhost:5173';
  const formattedBudget = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(dto.totalBudget || 0);

  return `
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8" /><title>Alta de Misión Territorial</title></head>
      <body style="font-family: Arial, sans-serif; background-color: #fafaf9; margin: 0; padding: 24px; color: #1c1917;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 14px; overflow: hidden; border: 1px solid #e7e5e4;">
          <tr style="background-color: #1c1917;">
            <td style="padding: 24px; text-align: center; color: #ffffff;">
              <span style="display: inline-block; background-color: #E67324; color: #ffffff; font-size: 10px; font-weight: bold; padding: 3px 10px; border-radius: 20px; text-transform: uppercase;">Visto Bueno Nacional</span>
              <h1 style="margin: 10px 0 0 0; font-size: 19px; color: #ffffff;">Misión Creada y Habilitada</h1>
              <p style="margin: 4px 0 0 0; font-size: 12px; color: #a8a29e;">Misincol • Registro Oficial de Despliegue Territorial</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 26px;">
              <h2 style="margin: 0 0 14px 0; font-size: 16px; color: #1c1917;">Ficha de Despliegue: ${dto.teamName}</h2>
              <div style="background-color: #fafaf9; border: 1px solid #e7e5e4; border-radius: 10px; padding: 16px; margin-bottom: 20px;">
                <p style="margin: 0 0 8px 0; font-size: 13px;"><strong>Etnia / Territorio:</strong> ${dto.ethnicity} • ${dto.location}</p>
                <p style="margin: 0 0 8px 0; font-size: 13px;"><strong>Presupuesto Asignado:</strong> ${formattedBudget}</p>
                <p style="margin: 0 0 8px 0; font-size: 13px;"><strong>Líder Pastoral:</strong> ${dto.leader}</p>
                <p style="margin: 0 0 8px 0; font-size: 13px;"><strong>Correo de Acceso:</strong> <code style="background-color: #f5f5f4; padding: 2px 6px; border-radius: 4px;">${dto.leaderEmail}</code></p>
                <p style="margin: 0; font-size: 13px;"><strong>PIN Credencial:</strong> <code style="background-color: #fef3c7; color: #92400e; padding: 2px 6px; border-radius: 4px; font-weight: bold;">${dto.accessPin}</code></p>
              </div>
              <div style="text-align: center; margin: 24px 0 10px 0;">
                <a href="${appUrl}" style="background-color: #1c1917; color: #ffffff; padding: 13px 26px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 13px; display: inline-block;">
                  👉 Ir al Tablero de Supervisión Nacional
                </a>
              </div>
            </td>
          </tr>
          <tr style="background-color: #f5f5f4; border-top: 1px solid #e7e5e4;">
            <td style="padding: 14px; text-align: center; font-size: 11px; color: #78716c;">
              Registro de auditoría emitido automáticamente para la Dirección Nacional de Misincol.
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

