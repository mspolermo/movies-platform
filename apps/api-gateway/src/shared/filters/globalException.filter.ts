import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const path = request.url;
    const method = request.method;

    this.logger.error(
      `Exception occurred: ${this.formatException(exception)}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const message = exception.message;

      this.logger.warn(
        `HTTP Exception: ${status} - ${message} for ${method} ${path}`,
      );

      response.status(status).json({
        statusCode: status,
        message,
        timestamp: new Date().toISOString(),
        path,
      });

      return;
    }

    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const message = "Внутренняя ошибка сервера";

    this.logger.error(
      `Internal Server Error for ${method} ${path}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    const isProduction = process.env.NODE_ENV === "production";
    const details = this.formatException(exception);

    response.status(status).json({
      statusCode: status,
      message: isProduction ? message : details,
      timestamp: new Date().toISOString(),
      path,
      ...(isProduction ? {} : { details }),
    });
  }

  private formatException(exception: unknown): string {
    if (exception instanceof Error) {
      return exception.message;
    }

    if (typeof exception === "string") {
      return exception;
    }

    if (exception && typeof exception === "object") {
      const record = exception as Record<string, unknown>;

      if (typeof record.message === "string") {
        return record.message;
      }

      try {
        return JSON.stringify(record);
      } catch {
        return String(exception);
      }
    }

    return String(exception);
  }
}