import { NestFactory } from "@nestjs/core";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

import { AppModule } from "./app.module";

async function start() {
  // Создаем HTTP приложение
  const app = await NestFactory.create(AppModule);

  // Настраиваем CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Создаем микросервис
  const rabbitmqUrl = process.env.RABBITMQ_URL;
  const usersQueue = process.env.USERS_QUEUE;
  
  if (!rabbitmqUrl || !usersQueue) {
    throw new Error("RABBITMQ_URL and USERS_QUEUE must be defined");
  }
  
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitmqUrl],
      queue: usersQueue,
      queueOptions: {
        durable: false,
      },
    },
  });

  // Запускаем все сервисы
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
