import { Module } from '@nestjs/common';
import { ActivitiesModule } from './activities/activities.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { PlansModule } from './modules/plans/plans.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ObjectivesModule } from './objectives/objectives.module';
import { ReportsModule } from './reports/reports.module';
import { TeamsModule } from './teams/teams.module';
import { UsersModule } from './users/users.module';
import { WorkflowModule } from './workflow/workflow.module';
import { SecurityModule } from './security/security.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TeamsModule,
    ObjectivesModule,
    ActivitiesModule,
    ReportsModule,
    WorkflowModule,
    NotificationsModule,
    PlansModule,
    SecurityModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
