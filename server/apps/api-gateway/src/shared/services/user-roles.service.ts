import { Injectable } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { User } from '../interfaces';

//TODO: проверить нужен ли этот сервис и в правильном ли месте он лежит
@Injectable()
export class UserRolesService {
  private clientUsers: ClientProxy;

  constructor(private configService: ConfigService) {
    const rabbitmqUrl = this.configService.get<string>('RABBITMQ_URL');
    const usersQueue = this.configService.get<string>('USERS_QUEUE');

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
