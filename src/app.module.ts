import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TeamsModule } from './teams/teams.module';
import { ObjectivesModule } from './objectives/objectives.module';
import { ActivitiesModule } from './activities/activities.module';
import { ReportsModule } from './reports/reports.module';
import { PlansModule } from './modules/plans/plans.module';

@Module({
  imports: [
    AuthModule,
    TeamsModule,
    ObjectivesModule,
    ActivitiesModule,
    ReportsModule,
    PlansModule,
  ],
})
export class AppModule {}
