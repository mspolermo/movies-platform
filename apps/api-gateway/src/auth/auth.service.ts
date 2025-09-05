import {
  Injectable,
  OnModuleInit,
  ConflictException,
  UnauthorizedException,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { RabbitMQConfig } from "../config";
import { AuthDto, CreateUserDto, OauthCreateUserDto } from "@common/dto";
import { AuthResponse, RegistrationResponse } from "./interfaces";
import { TUserBased } from "@common/types";

interface ServiceError {
  message?: string;
  status?: string;
}

@Injectable()
export class AuthService implements OnModuleInit {
  private clientUsers: ClientProxy;

  constructor(
    private configService: ConfigService,
    private jwtService: JwtService
  ) {
    this.clientUsers = RabbitMQConfig.createAuthUsersClient(this.configService);
  }

  async onModuleInit(): Promise<void> {
    await RabbitMQConfig.connectWithRetry(this.clientUsers, "Auth Service");
  }

  async registrationUser(dto: CreateUserDto): Promise<RegistrationResponse> {
    try {
      const { user, token } = await firstValueFrom(
        this.clientUsers.send("registration", dto)
      );
      return { User: user, role: user.roles, token: token };
    } catch (error: unknown) {
      console.error("❌ Ошибка регистрации:", error);

      const serviceError = error as ServiceError;
      const errorMessage = serviceError?.message;
      const errorStatus = serviceError?.status;
      
      if (
        errorMessage?.includes("уже зарегистрирован") ||
        errorMessage?.includes("already registered") ||
        (errorStatus === "error" && errorMessage?.includes("Internal server error"))
      ) {
        throw new ConflictException(
          "Пользователь с таким email уже зарегистрирован"
        );
      }

      if (
        errorMessage?.includes("некорректный") ||
        errorMessage?.includes("invalid")
      ) {
        throw new UnauthorizedException("Некорректные данные для регистрации");
      }

      throw error;
    }
  }

  async outRegistrationUser(
    dto: OauthCreateUserDto
  ): Promise<RegistrationResponse> {
    try {
      const { user, token } = await firstValueFrom(
        this.clientUsers.send("outRegistration", dto)
      );
      return { User: user, role: user.roles, token: token };
    } catch (error: unknown) {
      console.error("❌ Ошибка OAuth регистрации:", error);

      const serviceError = error as ServiceError;
      const errorMessage = serviceError?.message;
      
      if (
        errorMessage?.includes("уже зарегистрирован") ||
        errorMessage?.includes("already registered")
      ) {
        throw new ConflictException(
          "Пользователь с таким email уже зарегистрирован"
        );
      }

      throw error;
    }
  }

  async loginUser(dto: AuthDto): Promise<AuthResponse> {
    try {
      const { user, token } = await firstValueFrom(
        this.clientUsers.send("login", dto)
      );
      return {
        email: user.email,
        userId: user.id,
        role: user.roles,
        token: token,
      };
    } catch (error) {
      console.error("❌ Ошибка входа:", error);

      const serviceError = error as ServiceError;
      const errorMessage = serviceError?.message;
      
      if (
        errorMessage?.includes("неверный пароль") ||
        errorMessage?.includes("wrong password")
      ) {
        throw new UnauthorizedException("Неверный email или пароль");
      }

      if (
        errorMessage?.includes("пользователь не найден") ||
        errorMessage?.includes("user not found")
      ) {
        throw new UnauthorizedException("Пользователь не найден");
      }

      throw error;
    }
  }

  async checkToken(user: TUserBased): Promise<TUserBased> {
    return user;
  }

  async refreshToken(user: TUserBased): Promise<{ token: string }> {
    try {
      // Генерируем новый токен только с необходимыми данными
      const payload = {
        sub: user.id, // ✅ Только ID пользователя
        email: user.email, // ✅ Email для логирования
      };

      const token = await this.jwtService.signAsync(payload);
      return { token };
    } catch (error) {
      console.error("❌ Ошибка обновления токена:", error);
      throw error;
    }
  }

  async checkConnection(): Promise<boolean> {
    try {
      // Проверяем соединение с RabbitMQ через ping
      await this.clientUsers.emit("ping", { timestamp: Date.now() });
      return true;
    } catch (error) {
      console.error("❌ Ошибка проверки соединения auth-users:", error);
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
