import { ConfigService } from '@nestjs/config';

export const getCorsConfig = (configService: ConfigService) => {
  const NODE_ENV = configService.get<string>('NODE_ENV', 'development');
  const allowedOrigins = configService.get<string>(
    'ALLOWED_ORIGINS',
    'http://localhost:3000,http://localhost:3001'
  );
  
  const corsOrigins = allowedOrigins.split(',').map(origin => origin.trim());
  
  return {
    origin: NODE_ENV === 'production' ? corsOrigins : true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  };
};
