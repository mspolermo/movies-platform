import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from '../../auth-users/src/users/dto/createUserDto';
import { AuthDto } from './dto/auth.dto';
import { CommentDTO } from './dto/commentDTO';
import { GenreDTO } from './dto/genreDTO';
import { UpdateFilmDTO } from './dto/updateFilmDTO';
import { OauthCreateUserDTO } from './dto/oauthCreateUserDTO';
import {
  User,
  Genre,
  Country,
  Film,
  Person,
  Comment,
  FilmFilters,
  SearchResult,
  FiltersResult,
  AuthResponse,
  RegistrationResponse,
  GenreDto,
  CountryDto,
  FilmDto,
  PersonDto,
  GenreListDto,
} from './app.model';

@Injectable()
export class AppService implements OnModuleInit {
  private clientUsers: ClientProxy;
  private clientData: ClientProxy;

  constructor(private configService: ConfigService) {
    const rabbitmqUrl = this.configService.get<string>(
      'RABBITMQ_URL',
      'amqp://rabbitmq:5672',
    );
    const usersQueue = this.configService.get<string>(
      'USERS_QUEUE',
      'users_queue',
    );
    const filmsQueue = this.configService.get<string>(
      'FILMS_QUEUE',
      'films_queue',
    );

    this.clientUsers = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [rabbitmqUrl],
        queue: usersQueue,
        queueOptions: {
          durable: false,
        },
      },
    });
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
      await this.clientUsers.connect();
      await this.clientData.connect();
    } catch (error) {
      console.error('❌ Ошибка подключения к RabbitMQ:', error);
      throw error;
    }
  }

  // Методы управления пользователями
  async registrationUser(dto: CreateUserDto): Promise<RegistrationResponse> {
    const { user, token } = await firstValueFrom(
      this.clientUsers.send('registration', dto),
    );
    return { User: user, role: user.roles, token: token };
  }

  async outRegistrationUser(
    dto: OauthCreateUserDTO,
  ): Promise<RegistrationResponse> {
    const { user, token } = await firstValueFrom(
      this.clientUsers.send('outRegistration', dto),
    );
    return { User: user, role: user.roles, token: token };
  }

  async loginUser(dto: AuthDto): Promise<AuthResponse> {
    const { user, token } = await firstValueFrom(
      this.clientUsers.send('login', dto),
    );
    return {
      email: user.email,
      userId: user.id,
      role: user.roles,
      token: token,
    };
  }

  // Методы трансформации данных
  private transformGenreDto(genre: Genre): GenreDto {
    return { nameRu: genre.nameRu, nameEn: genre.nameEn };
  }

  private transformCountryDto(country: Country): CountryDto {
    return {
      countryName: country.countryName,
      countryNameEn: country.countryNameEn,
    };
  }

  private transformFilmDto(film: Film): FilmDto {
    return { id: film.id, nameRu: film.filmNameRu, nameEn: film.filmNameEn };
  }

  private transformPersonDto(person: Person): PersonDto {
    return { id: person.id, nameRu: person.nameRu, nameEn: person.nameEn };
  }

  private transformGenreForListDto(genre: Genre): GenreListDto {
    return { id: genre.id, nameRu: genre.nameRu, nameEn: genre.nameEn };
  }

  // Методы фильтров и поиска
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

  async searchByName(name?: string): Promise<SearchResult> {
    // Обрабатываем undefined/null значения
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

  // Методы работы с фильмами
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

  // Методы работы с персонами
  async getPersonById(id: number): Promise<Person> {
    return await firstValueFrom(this.clientData.send('getPersonById', id));
  }

  async findPersonsByNameAndProfession(
    name?: string,
    id?: number,
  ): Promise<Person[]> {
    return await firstValueFrom(
      this.clientData.send('findPersonsByNameAndProfession', { name, id }),
    );
  }

  // Методы работы с жанрами
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

  // Методы работы с комментариями
  async getCommentsByFilmId(id: number): Promise<Comment[]> {
    return await firstValueFrom(
      this.clientData.send('getCommentsByFilmId', id),
    );
  }

  async createComment(
    filmId: number,
    dto: CommentDTO,
    userId: number,
  ): Promise<Comment> {
    return await firstValueFrom(
      this.clientData.send('createComment', { filmId, dto, userId }),
    );
  }

  // Token validation
  async checkToken(user: User): Promise<User> {
    return user;
  }
}
