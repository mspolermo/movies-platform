import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { FilmsService } from './films/films.service';
import { Public } from './shared/guards';

@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly filmsService: FilmsService,
  ) {}

  @Public()
  @Get('/health')
  async health() {
    console.log('🏥 Health check запрос');
    
    // Проверяем реальное состояние RabbitMQ соединений
    const rabbitmqStatus = {
      users: await this.checkRabbitMQConnection('users'),
      films: await this.checkRabbitMQConnection('films'),
    };

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'api-gateway',
      rabbitmq: rabbitmqStatus,
    };
  }

  private async checkRabbitMQConnection(service: string): Promise<string> {
    try {
      if (service === 'users') {
        // Проверяем соединение с auth-users через проверку клиента
        const isConnected = this.authService.isConnected();
        return isConnected ? 'connected' : 'disconnected';
      } else if (service === 'films') {
        // Проверяем соединение с kino-db через проверку клиента
        const isConnected = this.filmsService.isConnected();
        return isConnected ? 'connected' : 'disconnected';
      }
      return 'unknown';
    } catch (error) {
      console.error(`❌ Ошибка проверки соединения ${service}:`, error);
      return 'disconnected';
    }
  }
}
