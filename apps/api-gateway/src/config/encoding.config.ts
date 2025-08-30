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
    if (req.query) {
      Object.keys(req.query).forEach(key => {
        if (typeof req.query[key] === 'string') {
          const originalValue = req.query[key] as string;
          
          // Проверяем, нужно ли декодировать URL encoding
          if (originalValue.includes('%')) {
            req.query[key] = decodeURIComponent(originalValue);
          } else {
            // Если нет % символов, но есть искаженные символы, исправляем
            const fixedValue = Buffer.from(originalValue, 'latin1').toString('utf8');
            if (fixedValue !== originalValue) {
              console.log(`🔧 Исправляем кодировку для ${key}:`, {
                original: originalValue,
                fixed: fixedValue
              });
              req.query[key] = fixedValue;
            }
          }
        }
      });
    }
    
    next();
  };
};
