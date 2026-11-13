import { Module } from '@nestjs/common';
import { JsonDbModule } from './common/db/json-db.module';
import { ActivitiesModule } from './activities/activities.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ObjectivesModule } from './objectives/objectives.module';
import { ReportsModule } from './reports/reports.module';
import { TeamsModule } from './teams/teams.module';
import { UsersModule } from './users/users.module';
import { WorkflowModule } from './workflow/workflow.module';
import { SecurityModule } from './security/security.module';
import { AuditModule } from './audit/audit.module';

@Module({
  imports: [
    JsonDbModule,
    AuthModule,
    UsersModule,
    TeamsModule,
    ObjectivesModule,
    ActivitiesModule,
    ReportsModule,
    WorkflowModule,
    NotificationsModule,
    SecurityModule,
    AuditModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
