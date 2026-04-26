import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { createRmqMicroserviceOptions } from "apps/api-gateway/src/shared/rmq/rmq.factory";

import { AppModule } from "./app.module";

async function start() {
  // Создаем HTTP приложение
  const app = await NestFactory.create(AppModule);

  // Настраиваем CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Получаем ConfigService из DI
  const config = app.get(ConfigService);

  // Подключаем микросервис через нормальный factory
  app.connectMicroservice(
    createRmqMicroserviceOptions(config, "USERS_QUEUE")
  );

  // Запускаем микросервисы
  await app.startAllMicroservices();

  // Запускаем HTTP сервер
  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`Auth-users service started on port ${port}`);
}

start();

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("🔄 Получен сигнал SIGTERM, закрываю приложение...");
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("🔄 Получен сигнал SIGINT, закрываю приложение...");
  process.exit(0);
});