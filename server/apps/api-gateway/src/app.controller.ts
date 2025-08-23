import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/health')
  async health() {
    console.log('🏥 Health check запрос');
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'api-gateway',
      rabbitmq: {
        users: 'connected', // TODO: проверить реальный статус
        films: 'connected', // TODO: проверить реальный статус
      },
    };
  }
}
