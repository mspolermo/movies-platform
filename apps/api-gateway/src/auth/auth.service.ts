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
import { AuthDto, CreateUserDto, OauthCreateUserDTO } from "./dto";
import { AuthResponse, RegistrationResponse } from "./interfaces";
import { TUserBased } from "@common/types";

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
    } catch (error) {
      console.error("❌ Ошибка регистрации:", error);

      // Маппинг ошибок от auth-users сервиса
      if (
        error?.message?.includes("уже зарегистрирован") ||
        error?.message?.includes("already registered") ||
        (error?.status === "error" &&
          error?.message?.includes("Internal server error"))
      ) {
        throw new ConflictException(
          "Пользователь с таким email уже зарегистрирован"
        );
      }

      if (
        error?.message?.includes("некорректный") ||
        error?.message?.includes("invalid")
      ) {
        throw new UnauthorizedException("Некорректные данные для регистрации");
      }

      // Если это объект с ошибкой, извлекаем сообщение
      if (error && typeof error === "object" && "message" in error) {
        throw new Error(error.message as string);
      }

      throw error;
    }
  }

  async outRegistrationUser(
    dto: OauthCreateUserDTO
  ): Promise<RegistrationResponse> {
    try {
      const { user, token } = await firstValueFrom(
        this.clientUsers.send("outRegistration", dto)
      );
      return { User: user, role: user.roles, token: token };
    } catch (error) {
      console.error("❌ Ошибка OAuth регистрации:", error);

      // Маппинг ошибок от auth-users сервиса
      if (
        error?.message?.includes("уже зарегистрирован") ||
        error?.message?.includes("already registered")
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

      // Маппинг ошибок от auth-users сервиса
      if (
        error?.message?.includes("неверный пароль") ||
        error?.message?.includes("wrong password")
      ) {
        throw new UnauthorizedException("Неверный email или пароль");
      }

      if (
        error?.message?.includes("пользователь не найден") ||
        error?.message?.includes("user not found")
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
