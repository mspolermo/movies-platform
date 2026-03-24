import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

import { RabbitMQConfig } from "../../config";

/**
 * Базовый класс для всех микросервисных клиентов
 */
@Injectable()
export abstract class BaseMicroserviceService implements OnModuleInit {
  protected clientData: ClientProxy;

  constructor(
    protected configService: ConfigService,
    private serviceName: string,
    private clientType: 'kino-db' | 'auth-users' = 'kino-db'
  ) {
    this.clientData = clientType === 'kino-db' 
      ? RabbitMQConfig.createKinoDbClient(this.configService)
      : RabbitMQConfig.createAuthUsersClient(this.configService);
  }

  /**
   * Инициализация соединения с микросервисом
   */
  async onModuleInit(): Promise<void> {
    await RabbitMQConfig.connectWithRetry(this.clientData, this.serviceName);
  }

  /**
   * Универсальный метод для отправки сообщений в микросервис
   * @param pattern - паттерн сообщения
   * @param data - данные для отправки
   * @returns Promise с результатом
   */
  protected async sendMessage<T>(pattern: string, data: unknown): Promise<T> {
    return await firstValueFrom(this.clientData.send(pattern, data));
  }

  /**
   * Проверка состояния соединения с микросервисом
   * @returns true если соединение активно
   */
  isConnected(): boolean {
    try {
      if (!this.clientData) return false;
      
      // Проверяем наличие свойства _closed для определения состояния
      const clientWithClosed = this.clientData as ClientProxy & { _closed?: boolean };
      if ('_closed' in clientWithClosed) {
        return !clientWithClosed._closed;
      }
      
      return true; // Если нет свойства _closed, считаем соединение активным
    } catch (error) {
      return false;
    }
  }

  /**
   * Проверка соединения через ping
   * @returns Promise<boolean> - результат проверки
   */
  async checkConnection(): Promise<boolean> {
    try {
      // Проверяем соединение с RabbitMQ через ping
      await this.clientData.emit("ping", { timestamp: Date.now() });
      return true;
    } catch (error) {
      console.error(`❌ Ошибка проверки соединения ${this.serviceName}:`, error);
      return false;
    }
  }
}
