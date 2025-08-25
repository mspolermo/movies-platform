import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { FiltersResult, GenreDto, CountryDto } from './dto';
import { Genre, Country } from '../shared/interfaces';

@Injectable()
export class FiltersService implements OnModuleInit {
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

  async getFilters(): Promise<FiltersResult> {
    const [genres, countries, years] = await Promise.all([
      firstValueFrom(this.clientData.send('getAll.genres', '')),
      firstValueFrom(this.clientData.send('getAll.countries', '')),
      firstValueFrom(this.clientData.send('getAllFilmYears', '')),
    ]);

    return {
      genres: genres.map(this.transformGenreDto),
      countries: countries.map(this.transformCountryDto),
      years,
    };
  }

  private transformGenreDto(genre: Genre): GenreDto {
    return { nameRu: genre.nameRu, nameEn: genre.nameEn };
  }

  private transformCountryDto(country: Country): CountryDto {
    return {
      countryName: country.countryName,
      countryNameEn: country.countryNameEn,
    };
  }
}
