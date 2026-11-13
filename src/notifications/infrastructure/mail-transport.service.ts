// Servicio de transporte de correo con soporte Google SMTP y bcc de respaldo
import { Injectable, Logger } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import { EmailSendOptions, MailSendResult } from '../domain/notification.types';

@Injectable()
export class MailTransportService {
  private readonly logger = new Logger(MailTransportService.name);
  private transporter: Transporter | null = null;

  constructor() {
    this.initTransporter();
  }

  private initTransporter(): void {
    const user = process.env.MAIL_USER?.trim();
    const pass = process.env.MAIL_PASS?.trim();
    if (!user || !pass) {
      this.logger.warn('Credenciales Google no configuradas. Modo simulación activado.');
      return;
    }
    const host = process.env.MAIL_HOST || 'smtp.gmail.com';
    const port = Number(process.env.MAIL_PORT) || 587;
    const secure = process.env.MAIL_SECURE === 'true' || port === 465;
    this.transporter = createTransport({
      host,
      port,
      secure,
      auth: { user, pass: pass.replace(/\s+/g, '') },
    });
    this.logger.log(`SMTP inicializado para ${user} en ${host}:${port}`);
  }

  isConfigured(): boolean {
    return Boolean(process.env.MAIL_USER?.trim() && process.env.MAIL_PASS?.trim());
  }

  getConfiguredUser(): string | null {
    const user = process.env.MAIL_USER?.trim();
    if (!user) return null;
    return user.replace(/(.{3})(.*)(@.*)/, '$1***$3');
  }

  async send(options: EmailSendOptions): Promise<MailSendResult> {
    const from = options.from || process.env.MAIL_FROM || 'Misincol <notificaciones@misincol.org>';
    const to = Array.isArray(options.to) ? options.to.join(', ') : options.to;
    const adminCopy = process.env.MAIL_USER?.trim();

    if (!this.transporter) {
      this.logger.log(`[SIMULACIÓN] Para: ${to} | Asunto: ${options.subject}`);
      return { success: true, simulated: true, messageId: `sim-${Date.now()}` };
    }

    try {
      const info = await this.transporter.sendMail({
        from,
        to,
        bcc: adminCopy && to !== adminCopy ? adminCopy : undefined,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });
      this.logger.log(`Correo enviado a ${to} (copia admin a ${adminCopy}). ID: ${info.messageId}`);
      return { success: true, messageId: info.messageId, simulated: false };
    } catch (err: any) {
      this.logger.error(`Error SMTP a ${to}: ${err.message}`, err.stack);
      return { success: false, error: err.message };
    }
  }

  async verifyConnection(): Promise<{ connected: boolean; error?: string }> {
    if (!this.transporter) return { connected: false, error: 'Credenciales no configuradas' };
    try {
      await this.transporter.verify();
      return { connected: true };
    } catch (err: any) {
      return { connected: false, error: err.message };
    }
  }
}
