import { Request, Response, NextFunction } from 'express';

/**
 * Middleware для исправления кодировки UTF-8 в query параметрах
 * Решает проблему с искаженными кириллическими символами
 */
export const getEncodingMiddleware = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Устанавливаем правильный Content-Type с кодировкой
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    // Express автоматически декодирует URL-encoded параметры, но иногда
    // может быть проблема с кириллицей, если исходный URL был неправильно закодирован
    if (!req.query) {
      next();
      return;
    }

    const query: Record<string, unknown> = { ...req.query };
    let changed = false;

    for (const key of Object.keys(query)) {
      const queryValue = query[key];
      if (typeof queryValue !== 'string' || queryValue.length === 0) {
        continue;
      }
      // Символы, которые выглядят как URL-encoded, но не были декодированы (например %D0)
      if (!queryValue.includes('%')) {
        continue;
      }
      try {
        query[key] = decodeURIComponent(queryValue);
        changed = true;
      } catch {
        // оставляем исходное значение
      }
    }

    if (changed) {
      Object.defineProperty(req, 'query', {
        value: query,
        writable: true,
        configurable: true,
        enumerable: true,
      });
    }

    next();
  };
};
