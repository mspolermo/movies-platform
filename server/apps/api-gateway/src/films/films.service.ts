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
    try {
      await this.clientData.connect();
    } catch (error) {
      console.error('❌ Ошибка подключения к RabbitMQ:', error);
      throw error;
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
}
