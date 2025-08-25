import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { GenreDTO, GenreListDto } from './dto';
import { Genre } from '../shared/interfaces';

@Injectable()
export class GenresService implements OnModuleInit {
  private clientData: ClientProxy;

  constructor(private configService: ConfigService) {
    const rabbitmqUrl = this.configService.get<string>('RABBITMQ_URL');
    const filmsQueue = this.configService.get<string>('FILMS_QUEUE');

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

  async getAllGenres(): Promise<GenreListDto[]> {
    const genres = await firstValueFrom(
      this.clientData.send('getAll.genres', ''),
    );
    return genres.map(this.transformGenreForListDto);
  }

  async updateGenre(id: number, dto: GenreDTO): Promise<Genre> {
    return await firstValueFrom(
      this.clientData.send('updateGenre', { id, dto }),
    );
  }

  private transformGenreForListDto(genre: Genre): GenreListDto {
    return { id: genre.id, nameRu: genre.nameRu, nameEn: genre.nameEn };
  }
}
