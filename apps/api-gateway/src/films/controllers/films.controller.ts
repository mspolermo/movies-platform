import type {
  TFilmDetailsResponse,
  TFilmListItemResponse,
  TFilmsResponse,
  TPaginatedPersonsResponse,
  TProfessionItemResponse,
} from "@common/types";

import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

import { PaginatedPersonsResponseDto } from "../../persons/dto";
import { ProfessionItemResponseDto } from "../../professions/dto";
import { JwtAuthGuard, Public } from "../../shared";
import {
  FilmDetailsResponseDto,
  FilmListItemResponseDto,
  FilmsPaginationResponseDto,
  GetFilmPersonsByProfessionDto,
  GetSimilarFilmsDto,
  SearchFilmsDto,
} from "../dto";
import { FilmsService } from "../services";

@ApiTags("Films")
@Controller("films")
@UseGuards(JwtAuthGuard)
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: "Поиск фильмов" })
  @ApiOkResponse({
    description: "Список фильмов",
    type: FilmsPaginationResponseDto,
  })
  searchFilms(
    @Query(new ValidationPipe({ transform: true }))
    query: SearchFilmsDto
  ): Promise<TFilmsResponse> {
    return this.filmsService.searchFilms(query);
  }

  @Public()
  @Get(":id/similar")
  @ApiOperation({
    summary: "Получить похожие фильмы по жанрам",
  })
  @ApiOkResponse({
    description: "Список похожих фильмов",
    type: FilmListItemResponseDto,
    isArray: true,
  })
  @ApiResponse({
    status: 404,
    description: "Фильм не найден",
  })
  getSimilarFilms(
    @Param("id", ParseIntPipe) filmId: number,
    @Query(new ValidationPipe({ transform: true }))
    query: GetSimilarFilmsDto
  ): Promise<TFilmListItemResponse[]> {
    return this.filmsService.getSimilarFilms({
      filmId,
      limit: query.limit,
    });
  }

  @Public()
  @Get(":id/professions")
  @ApiOperation({ summary: "Получить профессии фильма" })
  @ApiOkResponse({
    description: "Список профессий фильма",
    type: ProfessionItemResponseDto,
    isArray: true,
  })
  getFilmProfessions(
    @Param("id", ParseIntPipe) id: number
  ): Promise<TProfessionItemResponse[]> {
    return this.filmsService.getFilmProfessions({
      filmId: id,
    });
  }

  @Public()
  @Get(":id/persons-by-profession")
  @ApiOperation({
    summary: "Получить персон фильма по профессии",
  })
  @ApiOkResponse({
    description: "Список персон",
    type: PaginatedPersonsResponseDto,
  })
  getFilmPersonsByProfession(
    @Param("id", ParseIntPipe) filmId: number,
    @Query(new ValidationPipe({ transform: true }))
    query: GetFilmPersonsByProfessionDto
  ): Promise<TPaginatedPersonsResponse> {
    return this.filmsService.getFilmPersonsByProfession({
      filmId,
      ...query,
    });
  }

  @Public()
  @Get(":id")
  @ApiOperation({ summary: "Получить фильм по id" })
  @ApiOkResponse({
    description: "Информация о фильме",
    type: FilmDetailsResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: "Фильм не найден",
  })
  getFilmById(
    @Param("id", ParseIntPipe) id: number
  ): Promise<TFilmDetailsResponse> {
    return this.filmsService.getFilmById(id);
  }
}
