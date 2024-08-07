import { Module } from '@nestjs/common';
import { EligibilityController } from './eligibility.controller';
import { EligibilityService } from './eligibility.service';

@Module({
  imports: [],
  controllers: [EligibilityController],
  providers: [EligibilityService],
})
export class EligibilityModule {}
