import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";

/**
 * Проверяет Origin/Referer для cookie-авторизуемых роутов (CSRF defense-in-depth).
 * В dev пропускает отсутствующий Origin (same-origin / curl).
 */
@Injectable()
export class OriginGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const nodeEnv = this.configService.get<string>("NODE_ENV", "development");

    if (nodeEnv !== "production") {
      return true;
    }

    const allowedOrigins = this.configService
      .get<string>("ALLOWED_ORIGINS", "http://localhost:3000")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean);

    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
      return true;
    }

    const referer = req.headers.referer;
    if (referer) {
      try {
        const refererOrigin = new URL(referer).origin;
        if (allowedOrigins.includes(refererOrigin)) {
          return true;
        }
      } catch {
        // невалидный Referer — отклоняем ниже
      }
    }

    throw new ForbiddenException("Недопустимый Origin");
  }
}
