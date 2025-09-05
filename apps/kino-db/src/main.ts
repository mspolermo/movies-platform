import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

async function bootstrap() {
  // Создаем HTTP приложение
  const app = await NestFactory.create(AppModule);

  // Настраиваем CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Создаем микросервис
  const rabbitmqUrl = process.env.RABBITMQ_URL;
  const filmsQueue = process.env.FILMS_QUEUE;
  
  if (!rabbitmqUrl || !filmsQueue) {
    throw new Error("RABBITMQ_URL and FILMS_QUEUE must be defined");
  }
  
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitmqUrl],
      queue: filmsQueue,
      queueOptions: {
        durable: false,
      },
    },
  });

  // Запускаем все сервисы
  await app.startAllMicroservices();

  // Запускаем HTTP сервер
  const port = process.env.PORT || 3002;
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
