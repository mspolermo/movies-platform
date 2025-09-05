import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { JwtService } from "@nestjs/jwt";
import { AUTH_ERROR } from "../constants/errors.constants";
import { AuthenticatedRequest } from "../interfaces";
import { TUserBased } from "@common/types";
import { IS_PUBLIC_KEY } from "./public.decorator";

//  создание класса, который реализует интерфейс CanActivate,
//  используемый для реализации стратегии защиты маршрута.
@Injectable()
export class JwtAuthGuard implements CanActivate {
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
      return true;
    }

    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();

    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        console.log("🔐 JWT Guard: Отсутствует заголовок Authorization");
        throw new UnauthorizedException({
          message: "Отсутствует заголовок авторизации",
        });
      }

      const [bearer, token] = authHeader.split(" ");

      if (bearer !== "Bearer" || !token) {
        console.log("🔐 JWT Guard: Неверный формат заголовка авторизации");
        throw new UnauthorizedException({
          message: "Неверный формат заголовка авторизации",
        });
      }

      if (!this.jwtService) {
        console.log("🔐 JWT Guard: JwtService недоступен");
        throw new UnauthorizedException({
          message: "Ошибка сервиса аутентификации",
        });
      }

      console.log("🔐 JWT Guard: Проверяю токен...");

      // Проверяем токен с новым форматом (только sub и email)
      const tokenPayload = this.jwtService.verify<{
        sub: number;
        email: string;
      }>(token);
      console.log(
        "🔐 JWT Guard: Токен проверен, пользователь ID:",
        tokenPayload.sub
      );

      // Валидация данных пользователя
      if (!tokenPayload.sub || !tokenPayload.email) {
        console.log("🔐 JWT Guard: Неполные данные пользователя в токене");
        throw new UnauthorizedException({
          message: "Неполные данные пользователя в токене",
        });
      }

      // Создаем объект пользователя без ролей (роли будут получены позже)
      const user: TUserBased = {
        id: tokenPayload.sub,
        email: tokenPayload.email,
      };

      req.user = user;
      return true;
    } catch (e) {
      if (e instanceof UnauthorizedException) {
        throw e;
      }

      if (e.name === "TokenExpiredError") {
        console.log("🔐 JWT Guard: Токен истек");
        throw new UnauthorizedException({
          message: "Токен истек",
        });
      }

      if (e.name === "JsonWebTokenError") {
        console.log("🔐 JWT Guard: Неверный формат токена");
        throw new UnauthorizedException({
          message: "Неверный формат токена",
        });
      }

      console.log("🔐 JWT Guard: Ошибка при проверке токена:", e.message);
      throw new UnauthorizedException({
        message: AUTH_ERROR,
      });
    }
  }
}
