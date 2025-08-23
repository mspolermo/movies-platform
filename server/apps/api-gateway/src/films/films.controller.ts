import {
  Controller,
  Get,
  Param,
  Patch,
  Delete,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FilmsService } from './films.service';
import { UpdateFilmDTO } from './dto';
import { Roles, RolesGuard } from '../shared/guards';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @ApiOperation({ summary: 'Получение фильма по id' })
  @ApiResponse({ status: 200, description: 'Информация о фильме' })
  @Get('/:id')
  async getFilmById(@Param('id') id: number) {
    return await this.filmsService.getFilmById(id);
  }

  @ApiOperation({ summary: 'Поиск фильмов' })
  @ApiResponse({ status: 200, description: 'Список фильмов' })
  @Get()
  async searchFilms(
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
    return await this.filmsService.searchFilms({
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

  @ApiOperation({ summary: 'Изменение фильма' })
  @ApiResponse({ status: 200 })
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Patch('/:id')
  async updateFilm(@Param('id') id: number, @Body() dto: UpdateFilmDTO) {
    return await this.filmsService.updateFilm(id, dto);
  }

  @ApiOperation({ summary: 'Удаление фильма' })
  @ApiResponse({ status: 200 })
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Delete('/:id')
  async deleteFilmById(@Param('id') id: number) {
    return await this.filmsService.deleteFilmById(id);
  }
}
