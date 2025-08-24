import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get('/health')
  async health() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'kino-db',
      database: 'postgres',
    };
  }
}
