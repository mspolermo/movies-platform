import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { AUTH_ERROR } from '../constants/errors.constants';
import { User, AuthenticatedRequest } from '../interfaces';

//  создание класса, который реализует интерфейс CanActivate,
//  используемый для реализации стратегии защиты маршрута.
@Injectable()
export class JwtAuthGuard implements CanActivate {
  //  * конструктор класса, принимающий в качестве аргумента объект сервиса JwtService,
  //  необходимый для работы с JWT токенами.
  constructor(private jwtService: JwtService) {}

  //  * метод, который определяет, будет ли маршрут защищен или нет.
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();

    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        console.log('🔐 JWT Guard: Отсутствует заголовок Authorization');
        throw new UnauthorizedException({
          message: 'Отсутствует заголовок авторизации',
        });
      }

      const [bearer, token] = authHeader.split(' ');

      if (bearer !== 'Bearer' || !token) {
        console.log('🔐 JWT Guard: Неверный формат заголовка авторизации');
        throw new UnauthorizedException({
          message: 'Неверный формат заголовка авторизации',
        });
      }

      if (!this.jwtService) {
        console.log('🔐 JWT Guard: JwtService недоступен');
        throw new UnauthorizedException({
          message: 'Ошибка сервиса аутентификации',
        });
      }

      console.log('🔐 JWT Guard: Проверяю токен...');

      const user = this.jwtService.verify<User>(token);
      console.log('🔐 JWT Guard: Токен проверен, пользователь ID:', user.id);

      // Валидация данных пользователя
      if (!user.id || !user.email || !user.roles) {
        console.log('🔐 JWT Guard: Неполные данные пользователя в токене');
        throw new UnauthorizedException({
          message: 'Неполные данные пользователя в токене',
        });
      }

      req.user = user;
      return true;
    } catch (e) {
      if (e instanceof UnauthorizedException) {
        throw e;
      }

      if (e.name === 'TokenExpiredError') {
        console.log('🔐 JWT Guard: Токен истек');
        throw new UnauthorizedException({
          message: 'Токен истек',
        });
      }

      if (e.name === 'JsonWebTokenError') {
        console.log('🔐 JWT Guard: Неверный формат токена');
        throw new UnauthorizedException({
          message: 'Неверный формат токена',
        });
      }

      console.log('🔐 JWT Guard: Ошибка при проверке токена:', e.message);
      throw new UnauthorizedException({
        message: AUTH_ERROR,
      });
    }
  }
}
