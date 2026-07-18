import { Request, Response, NextFunction } from 'express';

/**
 * Middleware для исправления кодировки UTF-8 в query параметрах
 * Решает проблему с искаженными кириллическими символами
 */
export const getEncodingMiddleware = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Устанавливаем правильный Content-Type с кодировкой
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    
    // Исправляем кодировку query параметров
    // Express автоматически декодирует URL-encoded параметры, но иногда
    // может быть проблема с кириллицей, если исходный URL был неправильно закодирован
    if (req.query) {
      Object.keys(req.query).forEach(key => {
        const queryValue = req.query[key];
        if (typeof queryValue === 'string' && queryValue.length > 0) {
          // Проверяем, есть ли в строке символы, которые выглядят как URL-encoded
          // но не были декодированы (например, %D0 вместо кириллицы)
          if (queryValue.includes('%')) {
            try {
              const decoded = decodeURIComponent(queryValue);
              req.query[key] = decoded;
              console.log(`🔧 Декодирован параметр ${key}:`, {
                original: queryValue,
                decoded: decoded
              });
            } catch {
              console.warn(`⚠️ Не удалось декодировать параметр ${key}:`, queryValue);
            }
          }
        }
      });
    }
    
    next();
  };
};
