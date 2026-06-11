import { INestApplication, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "./app.module";
import { getSwaggerConfig, getCorsConfig, getEncodingMiddleware } from "./config";
import { GlobalExceptionFilter } from "./shared";


let app: INestApplication | null = null;

async function bootstrap() {
  app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const PORT = configService.get("PORT", 5000);

  // Настройка CORS
  app.enableCors(getCorsConfig(configService));

  // для работоспособности DTO
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    })
  );

  // Настройка для правильной обработки query параметров
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('query parser', 'extended');

  // Middleware для исправления кодировки UTF-8
  app.use(getEncodingMiddleware());

  // Глобальный exception filter для обработки 500 ошибок
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Настройка Swagger
  const config = getSwaggerConfig();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("/api/docs", app, document);

  await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
}

bootstrap().catch((error) => {
  console.log("Main service", error);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("🔄 Получен сигнал SIGTERM, закрываю приложение...");
  try {
    await app?.close();
    console.log("✅ Приложение успешно закрыто");
    process.exit(0);
  } catch (error) {
    console.error("❌ Ошибка при закрытии приложения:", error);
    process.exit(1);
  }
});
