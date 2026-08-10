import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";

import { NETWORK } from "@common/constants/network";

import { AppModule } from "./app.module";
import { getSwaggerConfig, getCorsConfig, getEncodingMiddleware } from "./config";
import { GlobalExceptionFilter } from "./shared";


let app: NestExpressApplication | null = null;

async function bootstrap() {
  // NestExpressApplication нужен для Express 5 query parser (NestJS 11)
  app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  const PORT =
    Number(configService.get("PORT")) || NETWORK.gateway.listen;

  // Настройка CORS
  app.enableCors(getCorsConfig(configService));

  app.use(cookieParser());

  // для работоспособности DTO
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    })
  );
  // Настройка для правильной обработки query параметров
  app.set("query parser", "extended");

  // Middleware для исправления кодировки UTF-8
  app.use(getEncodingMiddleware());

  // Глобальный exception filter для обработки 500 ошибок
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Swagger — только non-production (B26 thin / ADR-009 track)
  if (configService.get<string>("NODE_ENV") !== "production") {
    const config = getSwaggerConfig();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("/api/docs", app, document);
  }

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
