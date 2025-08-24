import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { UpdateFilmDTO } from './dto';
import { FilmFilters } from './interfaces';
import { Film } from '../shared/interfaces';

@Injectable()
export class FilmsService implements OnModuleInit {
  private clientData: ClientProxy;

  constructor(private configService: ConfigService) {
    const rabbitmqUrl = this.configService.get<string>(
      'RABBITMQ_URL',
      'amqp://rabbitmq:5672',
    );
    const filmsQueue = this.configService.get<string>(
      'FILMS_QUEUE',
      'films_queue',
    );

    this.clientData = ClientProxyFactory.create({
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

  async onModuleInit(): Promise<void> {
    await this.connectWithRetry();
  }

  private async connectWithRetry(maxAttempts = 5): Promise<void> {
    for (let i = 0; i < maxAttempts; i++) {
      try {
        console.log(
          `🔄 Попытка подключения к RabbitMQ (${i + 1}/${maxAttempts})`,
        );
        await this.clientData.connect();
        console.log('✅ Успешное подключение к RabbitMQ');
        return;
      } catch (error) {
        console.error(
          `❌ Ошибка подключения к RabbitMQ (попытка ${i + 1}):`,
          error,
        );
        if (i === maxAttempts - 1) {
          console.error('❌ Все попытки подключения исчерпаны');
          throw error;
        }
        const delay = 1000 * (i + 1);
        console.log(`⏳ Ожидание ${delay}ms перед следующей попыткой...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  async getFilmById(id: number): Promise<Film> {
    return await firstValueFrom(this.clientData.send('getFilmById', id));
  }

  async updateFilm(id: number, dto: UpdateFilmDTO): Promise<Film> {
    return await firstValueFrom(
      this.clientData.send('updateFilm', { id, dto }),
    );
  }

  async deleteFilmById(id: number): Promise<boolean> {
    return await firstValueFrom(this.clientData.send('deleteFilmById', id));
  }

  async searchFilms(filters: FilmFilters): Promise<Film[]> {
    return await firstValueFrom(this.clientData.send('filters', filters));
  }

  async checkConnection(): Promise<boolean> {
    try {
      // Проверяем соединение с RabbitMQ через ping
      await this.clientData.emit('ping', { timestamp: Date.now() });
      return true;
    } catch (error) {
      console.error('❌ Ошибка проверки соединения kino-db:', error);
      return false;
    }
  }

  isConnected(): boolean {
    try {
      // Проверяем состояние клиента RabbitMQ
      return this.clientData !== undefined;
    } catch (error) {
      return false;
    }
  }
}
