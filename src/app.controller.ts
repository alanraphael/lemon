import { Controller, Get } from '@nestjs/common';
// import { AppService } from './app.service';

@Controller('health')
// @ApiTags('health')
export class AppController {
  @Get()
  async health() {
    return { message: 'OK', noIntercept: true };
  }
}
