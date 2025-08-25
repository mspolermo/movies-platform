import {
  Injectable,
  OnModuleInit,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
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

  async onModuleInit(): Promise<void> {
    await this.connectWithRetry();
  }

  private async connectWithRetry(maxAttempts = 5): Promise<void> {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        console.log(
          `🔄 Попытка подключения к RabbitMQ (${i + 1}/${maxAttempts})`,
        );
        await this.clientUsers.connect();
        console.log('✅ Успешное подключение к RabbitMQ');
        return;
      } catch (error) {
        console.error(
          `❌ Ошибка подключения к RabbitMQ (попытка ${i + 1}):`,
          error,
        );
        if (i === maxAttempts - 1) {
          console.error('❌ Все попытки подключения исчерпаны');
          throw error;
        }
        const delay = 1000 * (i + 1);
        console.log(`⏳ Ожидание ${delay}ms перед следующей попыткой...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  async registrationUser(dto: CreateUserDto): Promise<RegistrationResponse> {
    try {
      const { user, token } = await firstValueFrom(
        this.clientUsers.send('registration', dto),
      );
      return { User: user, role: user.roles, token: token };
    } catch (error) {
      console.error('❌ Ошибка регистрации:', error);

      // Маппинг ошибок от auth-users сервиса
      if (
        error?.message?.includes('уже зарегистрирован') ||
        error?.message?.includes('already registered') ||
        (error?.status === 'error' &&
          error?.message?.includes('Internal server error'))
      ) {
        throw new ConflictException(
          'Пользователь с таким email уже зарегистрирован',
        );
      }

      if (
        error?.message?.includes('некорректный') ||
        error?.message?.includes('invalid')
      ) {
        throw new UnauthorizedException('Некорректные данные для регистрации');
      }

      // Если это объект с ошибкой, извлекаем сообщение
      if (error && typeof error === 'object' && 'message' in error) {
        throw new Error(error.message as string);
      }

      throw error;
    }
  }

  async outRegistrationUser(
    dto: OauthCreateUserDTO,
  ): Promise<RegistrationResponse> {
    try {
      const { user, token } = await firstValueFrom(
        this.clientUsers.send('outRegistration', dto),
      );
      return { User: user, role: user.roles, token: token };
    } catch (error) {
      console.error('❌ Ошибка OAuth регистрации:', error);

      // Маппинг ошибок от auth-users сервиса
      if (
        error?.message?.includes('уже зарегистрирован') ||
        error?.message?.includes('already registered')
      ) {
        throw new ConflictException(
          'Пользователь с таким email уже зарегистрирован',
        );
      }

      throw error;
    }
  }

  async loginUser(dto: AuthDto): Promise<AuthResponse> {
    try {
      const { user, token } = await firstValueFrom(
        this.clientUsers.send('login', dto),
      );
      return {
        email: user.email,
        userId: user.id,
        role: user.roles,
        token: token,
      };
    } catch (error) {
      console.error('❌ Ошибка входа:', error);

      // Маппинг ошибок от auth-users сервиса
      if (
        error?.message?.includes('неверный пароль') ||
        error?.message?.includes('wrong password')
      ) {
        throw new UnauthorizedException('Неверный email или пароль');
      }

      if (
        error?.message?.includes('пользователь не найден') ||
        error?.message?.includes('user not found')
      ) {
        throw new UnauthorizedException('Пользователь не найден');
      }

      throw error;
    }
  }

  async checkToken(user: User): Promise<User> {
    return user;
  }

  async refreshToken(user: User): Promise<{ token: string }> {
    try {
      // Генерируем новый токен только с необходимыми данными
      const payload = {
        sub: user.id, // ✅ Только ID пользователя
        email: user.email, // ✅ Email для логирования
      };

      const token = await this.jwtService.signAsync(payload);
      return { token };
    } catch (error) {
      console.error('❌ Ошибка обновления токена:', error);
      throw error;
    }
  }

  async checkConnection(): Promise<boolean> {
    try {
      // Проверяем соединение с RabbitMQ через ping
      await this.clientUsers.emit('ping', { timestamp: Date.now() });
      return true;
    } catch (error) {
      console.error('❌ Ошибка проверки соединения auth-users:', error);
      return false;
    }
  }

  isConnected(): boolean {
    try {
      // Проверяем состояние клиента RabbitMQ
      return this.clientUsers !== undefined;
    } catch (error) {
      return false;
    }
  }
}
