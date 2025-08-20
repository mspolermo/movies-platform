import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  const PORT = configService.get<number>('PORT', 5000);
  const NODE_ENV = configService.get<string>('NODE_ENV', 'development');
  
  // Настройка CORS
  const allowedOrigins = configService.get<string>('ALLOWED_ORIGINS', 'http://localhost:3000,http://localhost:3001');
  const corsOrigins = allowedOrigins.split(',').map(origin => origin.trim());
  
  app.enableCors({
    origin: NODE_ENV === 'production' ? corsOrigins : true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  const config = new DocumentBuilder()
    .setTitle('Movies-platform')
    .setDescription('Документация REST API')
    .setVersion('1.0.1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);

  await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
}

bootstrap().catch((error) => {
  console.log('Main service', error);
});
