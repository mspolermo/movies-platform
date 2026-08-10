import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";

import { NETWORK } from "@common/constants/network";
import { createRmqMicroserviceOptions } from "@common/services";

import { AppModule } from "./app.module";

async function bootstrap() {
  // Создаем HTTP приложение
  const app = await NestFactory.create(AppModule);

  // Получаем конфиг из DI
  const config = app.get(ConfigService);

  // Подключаем RMQ через общий factory
  app.connectMicroservice(
    createRmqMicroserviceOptions(config, "FILMS_QUEUE")
  );

  // Запускаем микросервисы
  await app.startAllMicroservices();

  // HTTP сервер
  const port = Number(process.env.PORT) || NETWORK.kinoDb.listen;
  await app.listen(port);

  console.log(`Kino-db service started on port ${port}`);
}

bootstrap();

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("🔄 Получен сигнал SIGTERM, закрываю приложение...");
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("🔄 Получен сигнал SIGINT, закрываю приложение...");
  process.exit(0);
});