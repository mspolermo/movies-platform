import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { getSwaggerConfig, getCorsConfig } from "./config";
import { GlobalExceptionFilter } from "./shared/filters";

let app: any = null;

async function bootstrap() {
  app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const PORT = configService.get("PORT", 5000);

  // Настройка CORS
  app.enableCors(getCorsConfig(configService));

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

process.on("SIGINT", async () => {
  console.log("🔄 Получен сигнал SIGINT, закрываю приложение...");
  try {
    await app?.close();
    console.log("✅ Приложение успешно закрыто");
    process.exit(0);
  } catch (error) {
    console.error("❌ Ошибка при закрытии приложения:", error);
    process.exit(1);
  }
});
