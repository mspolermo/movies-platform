import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles-auth.decorator';
import { ACCESS_ERROR } from '../constants/errors.constants';
import { AuthenticatedRequest } from '../interfaces';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}
  /**
   * Метод, определяющий, может ли запрос быть обработан.
   * @param context - объект ExecutionContext, содержащий данные о запросе.
   * @returns boolean | Promise<boolean> | Observable<boolean>
   */
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );

      if (!requiredRoles) {
        return true;
      }

      const req = context.switchToHttp().getRequest<AuthenticatedRequest>();

      if (!req.user) {
        console.log('🔒 RolesGuard: Пользователь не аутентифицирован');
        throw new UnauthorizedException({
          message: 'Пользователь не аутентифицирован',
        });
      }

      if (!req.user.roles || !Array.isArray(req.user.roles)) {
        console.log('🔒 RolesGuard: У пользователя нет ролей');
        throw new HttpException(ACCESS_ERROR, HttpStatus.FORBIDDEN);
      }

      const hasRequiredRole = req.user.roles.some((role) =>
        requiredRoles.includes(role.value),
      );

      if (!hasRequiredRole) {
        console.log(
          `🔒 RolesGuard: Пользователь ${req.user.email} (ID: ${req.user.id}) не имеет требуемых ролей: ${requiredRoles.join(', ')}`,
        );
        throw new HttpException(ACCESS_ERROR, HttpStatus.FORBIDDEN);
      }

      console.log(
        `🔒 RolesGuard: Доступ разрешен для пользователя ${req.user.email} с ролями: ${req.user.roles.map((r) => r.value).join(', ')}`,
      );

      return true;
    } catch (e) {
      if (e instanceof UnauthorizedException || e instanceof HttpException) {
        throw e;
      }

      console.log('🔒 RolesGuard: Ошибка при проверке ролей:', e.message);
      throw new HttpException(ACCESS_ERROR, HttpStatus.FORBIDDEN);
    }
  }
}
