import type { TJwtUserRequest } from "@common/types";

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";

import { AuthenticatedRequest } from "../interfaces";

import { IS_PUBLIC_KEY } from "./public.decorator";

interface JWTError extends Error {
  name: string;
  message: string;
}

//  создание класса, который реализует интерфейс CanActivate,
//  используемый для реализации стратегии защиты маршрута.
@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name);

  //  * конструктор класса, принимающий в качестве аргумента объект сервиса JwtService,
  //  необходимый для работы с JWT токенами.
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  //  * метод, который определяет, будет ли маршрут защищен или нет.
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Проверяем, является ли эндпойнт публичным
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
      this.attachUserFromToken(req, true);
      return true;
    }

    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();

    try {
      if (this.attachUserFromToken(req)) {
        return true;
      }

      this.logger.debug("Missing Authorization header");
      throw new UnauthorizedException({
        message: "Отсутствует заголовок авторизации",
      });
    } catch (e) {
      if (e instanceof UnauthorizedException) {
        throw e;
      }

      const jwtError = e as JWTError;

      if (jwtError?.name === "TokenExpiredError") {
        this.logger.debug("JWT expired");
        throw new UnauthorizedException({
          message: "Токен истек",
        });
      }

      if (jwtError?.name === "JsonWebTokenError") {
        this.logger.debug("Invalid JWT format");
        throw new UnauthorizedException({
          message: "Неверный формат токена",
        });
      }

      this.logger.debug(
        `JWT verification failed: ${jwtError?.message || String(e)}`
      );
      throw new UnauthorizedException({
        message: "Пользователь не авторизован",
      });
    }
  }

  private attachUserFromToken(
    req: AuthenticatedRequest,
    optional = false
  ): boolean {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return false;
    }

    const [bearer, token] = authHeader.split(" ");

    if (bearer !== "Bearer" || !token) {
      return false;
    }

    try {
      const tokenPayload = this.jwtService.verify<{
        sub: number;
        email: string;
      }>(token);

      if (!tokenPayload.sub || !tokenPayload.email) {
        if (optional) {
          return false;
        }

        this.logger.debug("Incomplete JWT payload");
        throw new UnauthorizedException({
          message: "Неполные данные пользователя в токене",
        });
      }

      const user: TJwtUserRequest = {
        id: tokenPayload.sub,
        email: tokenPayload.email,
      };

      req.user = user;

      return true;
    } catch (e) {
      if (optional) {
        return false;
      }

      throw e;
    }
  }
}
