import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
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

  constructor() {
    this.clientUsers = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://rabbitmq:5672'],
        queue: 'users_queue',
        queueOptions: {
          durable: false,
        },
      },
    });
    this.clientData = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://rabbitmq:5672'],
        queue: 'films_queue',
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
    const { user, token } = await this.clientUsers
      .send('registration', dto)
      .toPromise();
    return { User: user, role: user.roles, token: token };
  }

  async outRegistrationUser(
    dto: OauthCreateUserDTO,
  ): Promise<RegistrationResponse> {
    const { user, token } = await this.clientUsers
      .send('outRegistration', dto)
      .toPromise();
    return { User: user, role: user.roles, token: token };
  }

  async loginUser(dto: AuthDto): Promise<AuthResponse> {
    const { user, token } = await this.clientUsers
      .send('login', dto)
      .toPromise();
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
      this.clientData.send('getAll.genres', '').toPromise(),
      this.clientData.send('getAll.countries', '').toPromise(),
      this.clientData.send('getAllFilmYears', '').toPromise(),
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
        this.clientData.send('searchFilmsByName', searchName).toPromise(),
        this.clientData.send('searchPersonsByName', searchName).toPromise(),
        this.clientData.send('searchGenresByName', searchName).toPromise(),
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
    return await this.clientData.send('getFilmById', id).toPromise();
  }

  async updateFilm(id: number, dto: UpdateFilmDTO): Promise<Film> {
    return await this.clientData.send('updateFilm', { id, dto }).toPromise();
  }

  async deleteFilmById(id: number): Promise<boolean> {
    return await this.clientData.send('deleteFilmById', id).toPromise();
  }

  async searchFilms(filters: FilmFilters): Promise<Film[]> {
    return await this.clientData.send('filters', filters).toPromise();
  }

  // Методы работы с персонами
  async getPersonById(id: number): Promise<Person> {
    return await this.clientData.send('getPersonById', id).toPromise();
  }

  async findPersonsByNameAndProfession(
    name?: string,
    id?: number,
  ): Promise<Person[]> {
    return await this.clientData
      .send('findPersonsByNameAndProfession', { name, id })
      .toPromise();
  }

  // Методы работы с жанрами
  async getAllGenres(): Promise<GenreListDto[]> {
    const genres = await this.clientData.send('getAll.genres', '').toPromise();
    return genres.map(this.transformGenreForListDto);
  }

  async updateGenre(id: number, dto: GenreDTO): Promise<Genre> {
    return await this.clientData.send('updateGenre', { id, dto }).toPromise();
  }

  // Методы работы с комментариями
  async getCommentsByFilmId(id: number): Promise<Comment[]> {
    return await this.clientData.send('getCommentsByFilmId', id).toPromise();
  }

  async createComment(
    filmId: number,
    dto: CommentDTO,
    userId: number,
  ): Promise<Comment> {
    return await this.clientData
      .send('createComment', { filmId, dto, userId })
      .toPromise();
  }

  // Token validation
  async checkToken(user: User): Promise<User> {
    return user;
  }
}
