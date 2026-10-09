import type {
  TAuthResponse,
  TAuthUsersRpcAuthResponse,
  TCurrentUserResponse,
  TRegistrationResponse,
  TJwtUserRequest,
} from "@common/types";

import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from "@nestjs/common";

import { AuthDto, CreateUserDto } from "@common/dto";

import { fromRpc } from "../../shared";
import { AuthClient } from "../clients";
import { rpcMessageIncludes } from "../helpers";

const mapRpcAuthResponse = (
  rpcResponse: TAuthUsersRpcAuthResponse,
): TAuthResponse => ({
  user: rpcResponse.user,
  accessToken: rpcResponse.accessToken,
});

/**
 * Auth-оркестрация на gateway: маппинг RPC → HTTP, ошибки.
 * Refresh в cookie ставит контроллер, не сервис.
 */
@Injectable()
export class AuthService {
  constructor(private readonly authClient: AuthClient) {}

  async ping(): Promise<boolean> {
    await this.authClient.ping();
    return true;
  }

  async registrationUser(dto: CreateUserDto): Promise<{
    body: TRegistrationResponse;
    refreshToken: string;
  }> {
    try {
      const rpcResponse = await this.authClient.registration(dto);
      return {
        body: mapRpcAuthResponse(rpcResponse),
        refreshToken: rpcResponse.refreshToken,
      };
    } catch (error: unknown) {
      this.handleAuthError(error, "registration");
    }
  }

  async loginUser(dto: AuthDto): Promise<{
    body: TAuthResponse;
    refreshToken: string;
  }> {
    try {
      const rpcResponse = await this.authClient.login(dto);
      return {
        body: mapRpcAuthResponse(rpcResponse),
        refreshToken: rpcResponse.refreshToken,
      };
    } catch (error: unknown) {
      this.handleAuthError(error, "login");
    }
  }

  async refreshByCookie(refreshToken: string): Promise<{
    body: TAuthResponse;
    refreshToken: string;
  }> {
    if (!refreshToken) {
      throw new UnauthorizedException("Сессия истекла");
    }

    try {
      const rpcResponse = await this.authClient.refresh(refreshToken);
      return {
        body: mapRpcAuthResponse(rpcResponse),
        refreshToken: rpcResponse.refreshToken,
      };
    } catch (error: unknown) {
      // TODO: Заменить определение ошибки по тексту на стабильный код ошибки
      // (например, INVALID_REFRESH_TOKEN) или проверку statusCode.
      // Преобразовывать в 401 только ошибки недействительного/истёкшего токена,
      // не маскируя инфраструктурные ошибки Auth Microservice.
      if (
        rpcMessageIncludes(
          error,
          "refresh token",
          "сессия",
          "недействительный refresh",
          "истёк",
        )
      ) {
        throw new UnauthorizedException("Сессия истекла");
      }

      throw error;
    }
  }

  async logoutByCookie(refreshToken: string | undefined): Promise<void> {
    if (!refreshToken) {
      return;
    }

    try {
      await this.authClient.logout(refreshToken);
    } catch {
      // logout идемпотентен — ошибка отзыва не блокирует очистку cookie.
      // TODO: Добавить логирование ошибки отзыва токена без раскрытия
      // самого токена и чувствительных данных.
    }
  }

  async getCurrentUser(
    user: TJwtUserRequest,
  ): Promise<TCurrentUserResponse> {
    return fromRpc(this.authClient.getUserById(user.id));
  }

  private handleAuthError(
    error: unknown,
    mode: "login" | "registration",
  ): never {
    // TODO: Перейти с поиска по тексту сообщения на стабильные коды ошибок
    // в RPC-контракте (например, USER_ALREADY_EXISTS).
    if (
      rpcMessageIncludes(
        error,
        "уже зарегистрирован",
        "already registered",
      )
    ) {
      throw new ConflictException(
        "Пользователь с таким email уже зарегистрирован",
      );
    }

    if (mode === "login") {
      // TODO: Использовать единый код ошибки для неверных учётных данных,
      // чтобы не зависеть от формулировок сообщений микросервиса.
      if (
        rpcMessageIncludes(
          error,
          "неверный пароль",
          "wrong password",
          "пользователь с таким email не найден",
          "user not found",
        )
      ) {
        throw new UnauthorizedException("Неверный email или пароль");
      }
    }

    // TODO: Проверить семантику ошибок валидации регистрации.
    // Некорректные данные обычно должны возвращать HTTP 400 (Bad Request),
    // а не 401 (Unauthorized).
    if (rpcMessageIncludes(error, "некорректный", "invalid")) {
      throw new UnauthorizedException(
        "Некорректные данные для регистрации",
      );
    }

    // TODO: Убедиться, что неизвестные RPC-ошибки корректно преобразуются
    // в HTTP-ошибки на границе Gateway и не раскрывают внутренние детали.
    throw error;
  }
}