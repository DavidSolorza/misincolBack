import { Injectable, Logger, Optional } from '@nestjs/common';
import { JsonDbService } from '../../common/db/json-db.service';
import { InAppNotification } from '../domain/notification.types';

const INITIAL_NOTIFICATIONS: InAppNotification[] = [
  {
    id: 'notif-init-1',
    category: 'SECURITY',
    severity: 'INFO',
    title: 'Gobernanza RBAC Actualizada',
    message: 'La matriz de roles y permisos se encuentra activa con salvaguardas de seguridad institucional.',
    isRead: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'notif-init-2',
    category: 'NOTES_AGENDA',
    severity: 'SUCCESS',
    title: 'Agenda Ministerial 2026 Habilitada',
    message: 'Se encuentra disponible el módulo de notas y compromisos de misión territorial.',
    isRead: false,
    createdAt: new Date().toISOString(),
  },
];

@Injectable()
export class NotificationStorageService {
  private readonly logger = new Logger(NotificationStorageService.name);
  private cache: InAppNotification[] = [...INITIAL_NOTIFICATIONS];

  constructor(@Optional() private readonly jsonDb?: JsonDbService) {}

  async onModuleInit(): Promise<void> {
    if (this.jsonDb) {
      this.cache = await this.jsonDb.read<InAppNotification>('notifications', INITIAL_NOTIFICATIONS);
      this.logger.log(`Cargadas ${this.cache.length} notificaciones desde almacenamiento.`);
    }
  }

  async getAll(): Promise<InAppNotification[]> {
    return [...this.cache];
  }

  async append(notification: InAppNotification): Promise<InAppNotification> {
    this.cache = [notification, ...this.cache];
    if (this.jsonDb) {
      await this.jsonDb.write('notifications', this.cache);
    }
    return notification;
  }

  async markAsRead(id: string): Promise<boolean> {
    const item = this.cache.find((n) => n.id === id);
    if (!item) return false;
    item.isRead = true;
    if (this.jsonDb) {
      await this.jsonDb.write('notifications', this.cache);
    }
    return true;
  }

  async markAllAsRead(filter?: { email?: string; teamId?: string }): Promise<number> {
    let count = 0;
    this.cache.forEach((n) => {
      const matchEmail = !filter?.email || !n.targetUserEmail || n.targetUserEmail === filter.email;
      const matchTeam = !filter?.teamId || !n.teamId || n.teamId === filter.teamId;
      if (matchEmail && matchTeam && !n.isRead) {
        n.isRead = true;
        count++;
      }
    });
    if (count > 0 && this.jsonDb) {
      await this.jsonDb.write('notifications', this.cache);
    }
    return count;
  }
}

