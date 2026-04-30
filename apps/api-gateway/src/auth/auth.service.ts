import type {
  TAuthResponse,
  TAuthUsersRpcAuthResponse,
  TAuthorizedUserResponse,
  TCheckTokenResponse,
  TRefreshTokenResponse,
  TRegistrationResponse,
  TRoleResponse,
  TJwtUserRequest,
} from "@common/types";

import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { AuthDto, CreateUserDto, OauthCreateUserDto } from "@common/dto";
import { RmqService, authUsersRpc } from "@common/services";

import { ServiceError } from "./interfaces";

//TODO: странные типы для мапперов на входе

const mapRoles = (roles?: TRoleResponse[]): TRoleResponse[] =>
  (roles ?? []).map(({ id, value, description }) => ({
    id,
    value,
    description,
  }));

const mapAuthorizedUser = (
  user: TAuthUsersRpcAuthResponse["user"]
): TAuthorizedUserResponse => ({
  id: user.id,
  email: user.email,
  name: user.name,
  roles: mapRoles(user.roles),
});

@Injectable()
export class AuthService {
  constructor(
    private readonly rmq: RmqService,
    private readonly jwtService: JwtService
  ) {}

  // ✅ используется в health-check
  async ping(): Promise<boolean> {
    await this.rmq.sendToUsers(authUsersRpc.health.ping, {});
    return true;
  }

  async registrationUser(dto: CreateUserDto): Promise<TRegistrationResponse> {
    try {
      const { user, token } =
        await this.rmq.sendToUsers(
          authUsersRpc.users.registration,
          dto
        );

      return {
        user: mapAuthorizedUser(user),
        role: mapRoles(user.roles),
        token,
      };
    } catch (error: unknown) {
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
      const { user, token } =
        await this.rmq.sendToUsers(
          authUsersRpc.users.outRegistration,
          dto
        );

      return {
        user: mapAuthorizedUser(user),
        role: mapRoles(user.roles),
        token,
      };
    } catch (error: unknown) {
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
      const { user, token } =
        await this.rmq.sendToUsers(
          authUsersRpc.users.login,
          dto
        );

      return {
        email: user.email,
        userId: user.id,
        role: mapRoles(user.roles),
        token,
      };
    } catch (error: unknown) {
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
    const payload = {
      sub: user.id,
      email: user.email,
    };

    const token = await this.jwtService.signAsync(payload);
    return { token };
  }
}