import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ActivitiesModule } from '../activities/activities.module';
import { AuthModule } from '../auth/auth.module';
import { ReportsModule } from '../reports/reports.module';
import { TeamsModule } from '../teams/teams.module';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotificationStorageService } from './infrastructure/notification-storage.service';
import { NotificationDispatcherService } from './application/notification-dispatcher.service';
import { MailTransportService } from './infrastructure/mail-transport.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    AuthModule,
    ActivitiesModule,
    ReportsModule,
    TeamsModule,
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    NotificationStorageService,
    NotificationDispatcherService,
    MailTransportService,
  ],
  exports: [
    NotificationsService,
    NotificationStorageService,
    NotificationDispatcherService,
    MailTransportService,
  ],
})
export class NotificationsModule {}
