import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { ValidationPipe } from './pipes/validation.pipe';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CommentDTO } from './dto/commentDTO';
import { GenreDTO } from './dto/genreDTO';
import { CreateUserDto } from '../../auth-users/src/users/dto/createUserDto';
import { OauthCreateUserDTO } from './dto/oauthCreateUserDTO';
import { UpdateFilmDTO } from './dto/updateFilmDTO';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './guards/roles-auth.decorator';
import { User } from '../../auth-users/src/users/users.model';
import { Person } from '../../kino-db/src/persons/persons.model';
import { Comment } from '../../kino-db/src/comments/comments.model';
import { Film } from '../../kino-db/src/films/films.model';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Регистрация' })
  @ApiResponse({ status: 200 })
  @UsePipes(ValidationPipe)
  @Post('/registration')
  async registrationUser(@Body() dto: CreateUserDto) {
    return await this.appService.registrationUser(dto);
  }

  @ApiOperation({ summary: 'Авторизация через сторонние сайты' })
  @ApiResponse({ status: 200 })
  @UsePipes(ValidationPipe)
  @Post('/outRegistration')
  async outRegistrationUser(@Body() dto: OauthCreateUserDTO) {
    return await this.appService.outRegistrationUser(dto);
  }

  @ApiOperation({ summary: 'Логин' })
  @ApiResponse({ status: 200 })
  @UsePipes(ValidationPipe)
  @Post('/login')
  async loginUser(@Body() dto: AuthDto) {
    return await this.appService.loginUser(dto);
  }

  @ApiOperation({ summary: 'Фильтры для поиска' })
  @ApiResponse({ status: 200 })
  @Get('/filters')
  async filters() {
    return await this.appService.getFilters();
  }

  @ApiOperation({ summary: 'Получение персона по id' })
  @ApiResponse({ status: 200, type: [Person] })
  @Get('/person/:id')
  async getPersonById(@Param('id') id: number) {
    return await this.appService.getPersonById(id);
  }

  @ApiOperation({ summary: 'Получение фильма по id' })
  @ApiResponse({ status: 200, type: [Film] })
  @Get('/film/:id')
  async getFilmById(@Param('id') id: number) {
    return await this.appService.getFilmById(id);
  }

  @ApiOperation({ summary: 'Получение комента по id' })
  @ApiResponse({ status: 200, type: [Comment] })
  @Get('/comments/:id')
  async getCommentsByFilmId(@Param('id') id: number) {
    return await this.appService.getCommentsByFilmId(id);
  }

  @ApiOperation({ summary: 'Изменение фильма' })
  @ApiResponse({ status: 200 })
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Patch('/film/:id')
  async updateFilm(@Param('id') id: number, @Body() dto: UpdateFilmDTO) {
    return await this.appService.updateFilm(id, dto);
  }

  @ApiOperation({ summary: 'Удаление фильма' })
  @ApiResponse({ status: 200 })
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Delete('/film/:id')
  async deleteFilmById(@Param('id') id: number) {
    return await this.appService.deleteFilmById(id);
  }

  @ApiOperation({ summary: 'Изменение жанра' })
  @ApiResponse({ status: 200 })
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @UsePipes(ValidationPipe)
  @Patch('/genre/:id')
  async updateGenre(@Param('id') id: number, @Body() dto: GenreDTO) {
    return await this.appService.updateGenre(id, dto);
  }

  @ApiOperation({ summary: 'Получение всех жанров' })
  @ApiResponse({ status: 200 })
  @Get('/genres')
  async getAllGenres() {
    return await this.appService.getAllGenres();
  }

  @ApiOperation({ summary: 'Поиск фильмов' })
  @ApiResponse({ status: 200, type: [Film] })
  @Get('/films')
  async films(
    @Query('page') page: number,
    @Query('perPage') perPage: number,
    @Query('genres') genres?: string[],
    @Query('countries') countries?: string[],
    @Query('persons') persons?: string[],
    @Query('minRatingKp') minRatingKp?: number,
    @Query('minVotesKp') minVotesKp?: number,
    @Query('sortBy') sortBy?: string,
    @Query('year') year?: number,
  ) {
    return await this.appService.searchFilms({
      page,
      perPage,
      genres,
      countries,
      persons,
      minRatingKp,
      minVotesKp,
      sortBy,
      year,
    });
  }

  @ApiOperation({ summary: 'Создание комментария' })
  @ApiResponse({ status: 200, type: [Comment] })
  @UseGuards(JwtAuthGuard)
  @UsePipes(ValidationPipe)
  @Post('/:filmId')
  async createComment(
    @Param('filmId') filmId: number,
    @Body() dto: CommentDTO,
    @Req() req,
  ) {
    const userId = req.user.id;
    return await this.appService.createComment(filmId, dto, userId);
  }

  @ApiOperation({ summary: 'Поиск по части имени' })
  @Get('/search')
  async search(@Query('name') name?: string) {
    console.log('🔍 Поисковый запрос:', {
      name,
      timestamp: new Date().toISOString(),
    });

    try {
      const result = await this.appService.searchByName(name);
      console.log('✅ Поиск завершен успешно');
      return result;
    } catch (error) {
      console.error('❌ Ошибка в контроллере поиска:', error);
      throw error;
    }
  }

  @ApiOperation({ summary: 'Получение персона по имени и id профессии' })
  @ApiResponse({ status: 200, type: [Person] })
  @Get('/findPersonsByNameAndProfession')
  async findPersonsByNameAndProfession(
    @Query('name') name?: string,
    @Query('id') id?: number,
  ) {
    return await this.appService.findPersonsByNameAndProfession(name, id);
  }

  @ApiOperation({ summary: 'Получение пользователя по токену' })
  @ApiResponse({ status: 200, type: [User] })
  @UseGuards(JwtAuthGuard)
  @Get('/checkToken')
  async checkToken(@Req() req) {
    return await this.appService.checkToken(req.user);
  }

  @Get('/health')
  async health() {
    console.log('🏥 Health check запрос');
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'api-gateway',
      rabbitmq: {
        users: 'connected', // TODO: проверить реальный статус
        films: 'connected', // TODO: проверить реальный статус
      },
    };
  }
}
