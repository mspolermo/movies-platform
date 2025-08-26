import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { RabbitMQConfig } from '../../config';
import { User } from '../interfaces';

//TODO: проверить нужен ли этот сервис и в правильном ли месте он лежит
@Injectable()
export class UserRolesService implements OnModuleInit {
  private clientUsers: ClientProxy;

  constructor(private configService: ConfigService) {
    this.clientUsers = RabbitMQConfig.createAuthUsersClient(this.configService);
  }

  async onModuleInit(): Promise<void> {
    await RabbitMQConfig.connectWithRetry(
      this.clientUsers,
      'User Roles Service',
    );
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
