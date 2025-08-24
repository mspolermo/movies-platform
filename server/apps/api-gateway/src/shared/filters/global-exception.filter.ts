import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Логируем все ошибки для отладки
    this.logger.error(
      `Exception occurred: ${this.formatException(exception)}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    // Если это HttpException (известная ошибка), возвращаем как есть
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const message = exception.message;

      this.logger.warn(
        `HTTP Exception: ${status} - ${message} for ${request.method} ${request.url}`,
      );

      return response.status(status).json({
        statusCode: status,
        message: message,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }

    // Для неизвестных ошибок возвращаем общую ошибку
    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const message = 'Внутренняя ошибка сервера';

    this.logger.error(
      `Internal Server Error: ${message} for ${request.method} ${request.url}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    // В production не раскрываем детали ошибок
    const isProduction = process.env.NODE_ENV === 'production';
    
    return response.status(status).json({
      statusCode: status,
      message: isProduction ? message : this.formatException(exception),
      timestamp: new Date().toISOString(),
      path: request.url,
      ...(isProduction ? {} : { 
        details: this.formatException(exception)
      }),
    });
  }

  private formatException(exception: unknown): string {
    if (exception instanceof Error) {
      return exception.message;
    }
    
    if (typeof exception === 'string') {
      return exception;
    }
    
    if (typeof exception === 'object' && exception !== null) {
      // Обрабатываем объекты с сообщениями об ошибках
      if ('message' in exception && typeof exception.message === 'string') {
        return exception.message;
      }
      
      if ('status' in exception && 'message' in exception) {
        return `${exception.status}: ${exception.message}`;
      }
      
      // Для других объектов возвращаем JSON строку
      try {
        return JSON.stringify(exception, null, 2);
      } catch {
        return String(exception);
      }
    }
    
    return String(exception);
  }
}
