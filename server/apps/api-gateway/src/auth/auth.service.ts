import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthDto, CreateUserDto, OauthCreateUserDTO } from './dto';
import { AuthResponse, RegistrationResponse } from './interfaces';
import { User } from '../shared/interfaces';

@Injectable()
export class AuthService implements OnModuleInit {
  private clientUsers: ClientProxy;

  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {
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

  async onModuleInit(): Promise<void> {
    try {
      await this.clientUsers.connect();
    } catch (error) {
      console.error('❌ Ошибка подключения к RabbitMQ:', error);
      throw error;
    }
  }

  async registrationUser(dto: CreateUserDto): Promise<RegistrationResponse> {
    const { user, token } = await firstValueFrom(
      this.clientUsers.send('registration', dto),
    );
    return { User: user, role: user.roles, token: token };
  }

  async outRegistrationUser(
    dto: OauthCreateUserDTO,
  ): Promise<RegistrationResponse> {
    const { user, token } = await firstValueFrom(
      this.clientUsers.send('outRegistration', dto),
    );
    return { User: user, role: user.roles, token: token };
  }

  async loginUser(dto: AuthDto): Promise<AuthResponse> {
    const { user, token } = await firstValueFrom(
      this.clientUsers.send('login', dto),
    );
    return {
      email: user.email,
      userId: user.id,
      role: user.roles,
      token: token,
    };
  }

  async checkToken(user: User): Promise<User> {
    return user;
  }

  async refreshToken(user: User): Promise<{ token: string }> {
    // Генерируем новый токен с теми же данными пользователя
    const payload = {
      email: user.email,
      id: user.id,
      roles: user.roles,
    };

    const token = await this.jwtService.signAsync(payload);
    return { token };
  }
}
