import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function start() {
  // Создаем HTTP приложение
  const app = await NestFactory.create(AppModule);

  // Настраиваем CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Создаем микросервис
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL],
      queue: process.env.USERS_QUEUE,
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
process.on('SIGTERM', async () => {
  console.log('🔄 Получен сигнал SIGTERM, закрываю приложение...');
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🔄 Получен сигнал SIGINT, закрываю приложение...');
  process.exit(0);
});
