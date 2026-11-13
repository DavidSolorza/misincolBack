// Contratos y tipos de dominio para el sistema de notificaciones y correos institucionales

export type NotificationCategory = 'SECURITY' | 'NOTES_AGENDA' | 'PDM_CRITICAL' | 'SYSTEM';
export type NotificationSeverity = 'INFO' | 'SUCCESS' | 'WARNING' | 'CRITICAL';

export interface InAppNotification {
  id: string;
  category: NotificationCategory;
  severity: NotificationSeverity;
  title: string;
  message: string;
  targetUserEmail?: string;
  targetRole?: string;
  teamId?: string;
  teamName?: string;
  isRead: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface EmitNotificationDto {
  category: NotificationCategory;
  severity?: NotificationSeverity;
  title: string;
  message: string;
  targetUserEmail?: string;
  targetRole?: string;
  teamId?: string;
  teamName?: string;
  metadata?: Record<string, any>;
  sendEmail?: boolean;
}

export interface EmailSendOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

export interface MailSendResult {
  success: boolean;
  messageId?: string;
  simulated?: boolean;
  error?: string;
}

export interface TeamMemberEmailItem {
  fullName: string;
  email: string;
  roleInTeam?: string;
}

export interface TeamWelcomeEmailDto {
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  accessPin: string;
  members?: TeamMemberEmailItem[];
  portalUrl?: string;
}

export interface CriticalAlertEmailDto {
  teamName: string;
  alertType: 'Logística' | 'Salud' | 'Seguridad' | 'Institucional';
  message: string;
  reportedAt: string;
  leaderName?: string;
  recipientEmails: string[];
}
