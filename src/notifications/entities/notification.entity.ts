export class NotificationEntity {
  id: string;
  type: 'DEADLINE' | 'MISSING_REPORT' | 'SYSTEM';
  title: string;
  message: string;
  recipients: string[];
  teamId?: string;
  activityId?: string;
  status: 'SENT' | 'PENDING';
  createdAt: string;
}
