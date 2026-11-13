// Plantilla HTML: Bienvenida y credenciales de acceso para Integrantes de Equipo
export interface MemberWelcomeCredentialsEmailDto {
  memberName: string;
  memberEmail: string;
  memberRole?: string;
  teamName: string;
  ethnicity: string;
  location: string;
  accessPin: string;
}

export function buildMemberWelcomeCredentialsHtml(dto: MemberWelcomeCredentialsEmailDto): string {
  const appUrl = process.env.APP_URL || 'http://localhost:5173';
  const roleDisplay = dto.memberRole || 'Misionero de Campo / Integrante';
  const autoLoginUrl = `${appUrl}/?user=${encodeURIComponent(dto.memberEmail)}&pin=${encodeURIComponent(dto.accessPin)}&tab=team&auto=true`;

  return `
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8" /><title>Bienvenido(a) a Misincol</title></head>
      <body style="font-family: Arial, sans-serif; background-color: #fafaf9; margin: 0; padding: 24px; color: #1c1917;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 14px; overflow: hidden; border: 1px solid #e7e5e4;">
          <tr style="background-color: #8B251E;">
            <td style="padding: 24px; text-align: center; color: #ffffff;">
              <h1 style="margin: 0; font-size: 20px;">¡Bienvenido(a) al Equipo Ministerial!</h1>
              <p style="margin: 6px 0 0 0; font-size: 13px; opacity: 0.95;">Plataforma Oficial de Planificación y Desarrollo Ministerial</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 28px;">
              <p style="margin: 0 0 16px 0; font-size: 14px; line-height: 1.5;">Estimado(a) <strong>${dto.memberName}</strong>,</p>
              <p style="margin: 0 0 18px 0; font-size: 13.5px; line-height: 1.5; color: #44403c;">
                Ha sido registrado(a) oficialmente como integrante del equipo ministerial de la <strong>${dto.teamName}</strong> (${dto.ethnicity} • ${dto.location}) con el rol de <strong>${roleDisplay}</strong>. A continuación encontrará sus credenciales de acceso:
              </p>
              <div style="background-color: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 18px; margin-bottom: 24px;">
                <p style="margin: 0 0 10px 0; font-size: 13.5px;"><strong>📧 Usuario / Correo:</strong> <code style="background-color: #ffffff; padding: 3px 8px; border-radius: 6px; font-weight: bold; color: #8B251E;">${dto.memberEmail}</code></p>
                <p style="margin: 0 0 10px 0; font-size: 13.5px;"><strong>🔑 Contraseña / PIN del Equipo:</strong> <code style="background-color: #ffffff; padding: 3px 8px; border-radius: 6px; font-weight: bold; color: #8B251E;">${dto.accessPin}</code></p>
                <p style="margin: 0; font-size: 13.5px;"><strong>💼 Rol Asignado:</strong> <span style="font-weight: 600; color: #1c1917;">${roleDisplay}</span></p>
              </div>
              <div style="text-align: center; margin: 26px 0 14px 0;">
                <a href="${autoLoginUrl}" style="background-color: #8B251E; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 13.5px; display: inline-block; box-shadow: 0 4px 12px rgba(139,37,30,0.25);">
                  👉 Ingresar Directamente a Mi Plataforma
                </a>
              </div>
              <p style="text-align: center; margin: 12px 0 0 0; font-size: 11.5px; color: #78716c;">
                (El botón anterior completará automáticamente sus credenciales en pantalla para un acceso rápido)
              </p>
            </td>
          </tr>
          <tr style="background-color: #f5f5f4; border-top: 1px solid #e7e5e4;">
            <td style="padding: 14px; text-align: center; font-size: 11px; color: #78716c;">
              Coordinación Nacional Misincol • Bogotá D.C., Colombia
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}
