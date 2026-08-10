import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";

import { NETWORK } from "@common/constants/network";
import { createRmqMicroserviceOptions } from "@common/services";

import { AppModule } from "./app.module";

async function start() {
  // Создаем HTTP приложение
  const app = await NestFactory.create(AppModule);

  // Получаем ConfigService из DI
  const config = app.get(ConfigService);

  // Подключаем микросервис через нормальный factory
  app.connectMicroservice(
    createRmqMicroserviceOptions(config, "USERS_QUEUE")
  );

  // Запускаем микросервисы
  await app.startAllMicroservices();

  // Запускаем HTTP сервер
  const port = Number(process.env.PORT) || NETWORK.authUsers.listen;
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