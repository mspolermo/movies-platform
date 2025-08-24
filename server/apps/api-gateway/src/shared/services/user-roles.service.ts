import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { User, Role } from '../interfaces';

@Injectable()
export class UserRolesService {
  private clientUsers: ClientProxy;

  constructor(private configService: ConfigService) {
    const rabbitmqUrl = this.configService.get<string>(
      'RABBITMQ_URL',
      'amqp://rabbitmq:5672',
    );
    const usersQueue = this.configService.get<string>(
      'USERS_QUEUE',
      'users_queue',
    );

    this.clientUsers = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [rabbitmqUrl],
        queue: usersQueue,
        queueOptions: {
          durable: false,
        },
      },
    });
  }

  async getUserWithRoles(userId: number): Promise<User> {
    try {
      const user = await firstValueFrom(
        this.clientUsers.send('getUserById', userId),
      );
      return user;
    } catch (error) {
      console.error('❌ Ошибка получения ролей пользователя:', error);
      throw error;
    }
  }
}
