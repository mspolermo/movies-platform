import type {
  TFilmDetailsResponse,
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
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

import { JwtAuthGuard, Public } from "../../shared";
import { FilmsService } from "../application";
import {
  GetFilmPersonsByProfessionDto,
  SearchFilmsDto,
} from "../dto";

@ApiTags("Films")
@Controller("films")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FilmsController {
  constructor(
    private readonly filmsService: FilmsService
  ) {}

  @Public()
  @Get(":id")
  @ApiOperation({ summary: "Получить фильм по id" })
  @ApiResponse({
    status: 200,
    description: "Информация о фильме",
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

  @Public()
  @Get()
  @ApiOperation({ summary: "Поиск фильмов" })
  @ApiResponse({
    status: 200,
    description: "Список фильмов",
  })
  searchFilms(
    @Query(new ValidationPipe({ transform: true }))
    query: SearchFilmsDto
  ): Promise<TFilmsResponse> {
    return this.filmsService.searchFilms(query);
  }

  @Public()
  @Get(":id/professions")
  @ApiOperation({ summary: "Получить профессии фильма" })
  @ApiResponse({
    status: 200,
    description: "Список профессий фильма",
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
  @ApiResponse({
    status: 200,
    description: "Список персон",
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
}