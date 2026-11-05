import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ActivitiesModule } from '../activities/activities.module';
import { AuthModule } from '../auth/auth.module';
import { ReportsModule } from '../reports/reports.module';
import { TeamsModule } from '../teams/teams.module';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    AuthModule,
    ActivitiesModule,
    ReportsModule,
    TeamsModule,
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
