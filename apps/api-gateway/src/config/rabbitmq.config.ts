import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";

export class RabbitMQConfig {
  /**
   * Создает клиент для подключения к kino-db сервису
   */
  static createKinoDbClient(configService: ConfigService): ClientProxy {
    const rabbitmqUrl = configService.get<string>("RABBITMQ_URL");
    const filmsQueue = configService.get<string>("FILMS_QUEUE");

    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [rabbitmqUrl],
        queue: filmsQueue,
        queueOptions: {
          durable: false,
        },
      },
    });
  }

  /**
   * Создает клиент для подключения к auth-users сервису
   */
  static createAuthUsersClient(configService: ConfigService): ClientProxy {
    const rabbitmqUrl = configService.get<string>("RABBITMQ_URL");
    const usersQueue = configService.get<string>("USERS_QUEUE");

    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [rabbitmqUrl],
        queue: usersQueue,
        queueOptions: {
          durable: false,
        },
      },
    });
  }

  /**
   * Универсальный метод подключения с повторными попытками
   */
  static async connectWithRetry(
    client: ClientProxy,
    serviceName: string,
    maxAttempts = 5
  ): Promise<void> {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        console.log(
          `🔄 Попытка подключения к RabbitMQ для ${serviceName} (${
            i + 1
          }/${maxAttempts})`
        );
        await client.connect();
        console.log(`✅ Успешное подключение к RabbitMQ для ${serviceName}`);
        return;
      } catch (error) {
        console.error(
          `❌ Ошибка подключения к RabbitMQ для ${serviceName} (попытка ${
            i + 1
          }):`,
          error
        );
        if (i === maxAttempts - 1) {
          console.error(
            `❌ Все попытки подключения исчерпаны для ${serviceName}`
          );
          throw error;
        }
        const delay = 1000 * (i + 1);
        console.log(`⏳ Ожидание ${delay}ms перед следующей попыткой...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
}
