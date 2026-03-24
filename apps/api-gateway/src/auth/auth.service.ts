import type {
  TAuthResponse,
  TAuthorizedUserResponse,
  TCheckTokenResponse,
  TRefreshTokenResponse,
  TRegistrationResponse,
  TRoleResponse,
  TJwtUserRequest,
} from "@common/types";
import type { TUserOrmModel } from "@common/types/orm";

import {
  Injectable,
  OnModuleInit,
  ConflictException,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

import { AuthDto, CreateUserDto, OauthCreateUserDto } from "@common/dto";
import { authUsersRpc } from "@common/messaging";

import { RabbitMQConfig } from "../config";

import { ServiceError } from "./interfaces";



const mapRoles = (roles?: TUserOrmModel["roles"]): TRoleResponse[] =>
  (roles ?? []).map(({ id, value, description }) => ({
    id,
    value,
    description,
  }));

const mapAuthorizedUser = (user: TUserOrmModel): TAuthorizedUserResponse => ({
  id: user.id,
  email: user.email,
  name: user.name,
  roles: mapRoles(user.roles),
});



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

  async registrationUser(dto: CreateUserDto): Promise<TRegistrationResponse> {
    try {
      const { user, token } = await firstValueFrom(
        this.clientUsers.send(authUsersRpc.users.registration, dto)
      );
      return {
        user: mapAuthorizedUser(user),
        role: mapRoles(user.roles),
        token,
      };
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
  ): Promise<TRegistrationResponse> {
    try {
      const { user, token } = await firstValueFrom(
        this.clientUsers.send(authUsersRpc.users.outRegistration, dto)
      );
      return {
        user: mapAuthorizedUser(user),
        role: mapRoles(user.roles),
        token,
      };
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

  async loginUser(dto: AuthDto): Promise<TAuthResponse> {
    try {
      const { user, token } = await firstValueFrom(
        this.clientUsers.send(authUsersRpc.users.login, dto)
      );
      return {
        email: user.email,
        userId: user.id,
        role: mapRoles(user.roles),
        token,
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

  async checkToken(user: TJwtUserRequest): Promise<TCheckTokenResponse> {
    return {
      id: user.id,
      email: user.email,
    };
  }

  async refreshToken(user: TJwtUserRequest): Promise<TRefreshTokenResponse> {
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
