import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class AppController {
  @Get()
  async health() {
    return { message: 'OK', noIntercept: true };
  }
}
