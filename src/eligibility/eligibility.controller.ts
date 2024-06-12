import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { EligibilityService } from './eligibility.service';
import { InputCalculateEligibiliyDto } from './dto/input-calculate-eligibility.dto';
import { ApiBody } from '@nestjs/swagger';
import { EligibilityEntity } from './entities/eligibility.entity';
import { ShowEligibilityDto } from './dto/show-eligibility.dto';

@Controller()
export class EligibilityController {
  constructor(private readonly eligibilityService: EligibilityService) {}

  @Post()
  @ApiBody({ type: InputCalculateEligibiliyDto })
  async checkEligibility(@Body() input: InputCalculateEligibiliyDto) {
    try {
      const obj = new EligibilityEntity({ ...input });
      obj.validation();

      const result = this.eligibilityService.checkEligibility(obj);

      if (result.length > 0) {
        return new ShowEligibilityDto({ razoesDeInelegibilidade: result });
      }

      return new ShowEligibilityDto({
        economiaAnualDeCO2: obj.economiaAnualDeCO2(),
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
