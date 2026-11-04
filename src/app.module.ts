import { Module } from '@nestjs/common';
import { PlansModule } from './modules/plans/plans.module';

@Module({
  imports: [PlansModule],
})
export class AppModule {}
