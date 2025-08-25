import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { Film, Person, Genre } from '../shared/interfaces';

export interface SearchResult {
  films: FilmDto[];
  people: PersonDto[];
  genres: GenreDto[];
}

export interface FilmDto {
  id: number;
  nameRu: string;
  nameEn: string;
}

export interface PersonDto {
  id: number;
  nameRu: string;
  nameEn: string;
}

export interface GenreDto {
  nameRu: string;
  nameEn: string;
}

@Injectable()
export class SearchService implements OnModuleInit {
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

  async searchByName(name?: string): Promise<SearchResult> {
    const searchName = name || '';

    try {
      const [films, people, genres] = await Promise.all([
        firstValueFrom(this.clientData.send('searchFilmsByName', searchName)),
        firstValueFrom(this.clientData.send('searchPersonsByName', searchName)),
        firstValueFrom(this.clientData.send('searchGenresByName', searchName)),
      ]);

      return {
        films: films?.map(this.transformFilmDto) || [],
        people: people?.map(this.transformPersonDto) || [],
        genres: genres?.map(this.transformGenreDto) || [],
      };
    } catch (error) {
      console.error('❌ Ошибка при поиске:', error);
      throw error;
    }
  }

  private transformFilmDto(film: Film): FilmDto {
    return { id: film.id, nameRu: film.filmNameRu, nameEn: film.filmNameEn };
  }

  private transformPersonDto(person: Person): PersonDto {
    return { id: person.id, nameRu: person.nameRu, nameEn: person.nameEn };
  }

  private transformGenreDto(genre: Genre): GenreDto {
    return { nameRu: genre.nameRu, nameEn: genre.nameEn };
  }
}
