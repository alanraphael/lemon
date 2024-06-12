import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { EligibilityModule } from './eligibility/eligibility.module';

@Module({
  imports: [EligibilityModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
