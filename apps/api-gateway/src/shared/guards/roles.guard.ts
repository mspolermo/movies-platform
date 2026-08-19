import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import { UserRolesService } from "../../userRoles";
import { AuthenticatedRequest } from "../interfaces";

import { ROLES_KEY } from "./roles.decorator";

interface ErrorWithMessage {
  message: string;
}

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly logger = new Logger(RolesGuard.name);

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
        this.logger.debug("User not authenticated");
        throw new UnauthorizedException({
          message: "Пользователь не аутентифицирован",
        });
      }

      // Получаем полную информацию о пользователе с ролями из БД
      const userWithRoles = await this.userRolesService.getUserWithRoles(
        req.user.id
      );

      if (!userWithRoles.roles || !Array.isArray(userWithRoles.roles)) {
        this.logger.debug(
          `User ${req.user.id} has no roles; required: ${requiredRoles.join(", ")}`
        );
        throw new HttpException("Нет доступа", HttpStatus.FORBIDDEN);
      }

      const hasRequiredRole = userWithRoles.roles.some((role) =>
        requiredRoles.includes(role.value)
      );

      if (!hasRequiredRole) {
        this.logger.debug(
          `User ${userWithRoles.id} missing required roles: ${requiredRoles.join(", ")}`
        );
        throw new HttpException("Нет доступа", HttpStatus.FORBIDDEN);
      }

      // Обновляем пользователя в request с полной информацией
      req.user = userWithRoles;

      return true;
    } catch (e) {
      if (e instanceof UnauthorizedException) {
        throw e;
      }

      if (e instanceof HttpException) {
        const status = e.getStatus();
        // User lookup 404 при валидном JWT — authz, не «ресурс admin».
        if (status === HttpStatus.NOT_FOUND) {
          throw new UnauthorizedException({
            message: "Пользователь не аутентифицирован",
          });
        }
        // 403 deny / 5xx от fromRpc — как есть (B41).
        throw e;
      }

      const errorWithMessage = e as ErrorWithMessage;
      this.logger.error(
        `Roles check failed: ${errorWithMessage?.message || String(e)}`
      );
      // Не маскируем infra/неожиданные ошибки под 403 (B41).
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: "Ошибка проверки доступа",
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
