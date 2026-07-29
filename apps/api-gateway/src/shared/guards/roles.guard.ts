import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { UserRolesService } from "../../user-roles";
import { AuthenticatedRequest } from "../interfaces";

import { ROLES_KEY } from "./roles.decorator";

interface ErrorWithMessage {
  message: string;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userRolesService: UserRolesService
  ) {}

  /**
   * Метод, определяющий, может ли запрос быть обработан.
   * @param context - объект ExecutionContext, содержащий данные о запросе.
   * @returns Promise<boolean>
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()]
      );

      if (!requiredRoles) {
        return true;
      }

      const req = context.switchToHttp().getRequest<AuthenticatedRequest>();

      if (!req.user) {
        console.log("🔒 RolesGuard: Пользователь не аутентифицирован");
        throw new UnauthorizedException({
          message: "Пользователь не аутентифицирован",
        });
      }

      // Получаем полную информацию о пользователе с ролями из БД
      const userWithRoles = await this.userRolesService.getUserWithRoles(
        req.user.id
      );

      if (!userWithRoles.roles || !Array.isArray(userWithRoles.roles)) {
        console.log("🔒 RolesGuard: У пользователя нет ролей");
        throw new HttpException("Нет доступа", HttpStatus.FORBIDDEN);
      }

      const hasRequiredRole = userWithRoles.roles.some((role) =>
        requiredRoles.includes(role.value)
      );

      if (!hasRequiredRole) {
        console.log(
          `🔒 RolesGuard: Пользователь ${userWithRoles.email} (ID: ${
            userWithRoles.id
          }) не имеет требуемых ролей: ${requiredRoles.join(", ")}`
        );
        throw new HttpException("Нет доступа", HttpStatus.FORBIDDEN);
      }

      console.log(
        `🔒 RolesGuard: Доступ разрешен для пользователя ${
          userWithRoles.email
        } с ролями: ${userWithRoles.roles.map((r) => r.value).join(", ")}`
      );

      // Обновляем пользователя в request с полной информацией
      req.user = userWithRoles;

      return true;
    } catch (e) {
      if (e instanceof UnauthorizedException || e instanceof HttpException) {
        throw e;
      }

      const errorWithMessage = e as ErrorWithMessage;
      console.log("🔒 RolesGuard: Ошибка при проверке ролей:", errorWithMessage?.message || e);
      throw new HttpException("Нет доступа", HttpStatus.FORBIDDEN);
    }
  }
}
