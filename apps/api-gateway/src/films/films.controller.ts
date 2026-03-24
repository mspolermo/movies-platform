import type {
  TFilmDetailsResponse,
  TFilmsResponse,
  TGetFilmPersonsByProfessionRequest,
  TPaginatedPersonsResponse,
  TProfessionItemResponse,
} from "@common/types";

import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from "@nestjs/swagger";

import { JwtAuthGuard, Public } from "../shared/guards";

import { SearchFilmsDto } from "./dto";
import { FilmsService } from "./films.service";

@Controller("films")
@UseGuards(JwtAuthGuard) // Защищаем весь контроллер
@ApiBearerAuth()
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Public()
  @ApiOperation({ summary: "Получение фильма по id" })
  @ApiResponse({ status: 200, description: "Информация о фильме" })
  @ApiResponse({ status: 404, description: "Фильм не найден" })
  @Get("/:id")
  async getFilmById(@Param("id") id: number): Promise<TFilmDetailsResponse> {
    return await this.filmsService.getFilmById(id);
  }

  @Public()
  @ApiOperation({ summary: "Поиск фильмов" })
  @ApiResponse({ status: 200, description: "Список фильмов" })
  @Get()
  async searchFilms(
    @Query(new ValidationPipe({ transform: true })) query: SearchFilmsDto
  ): Promise<TFilmsResponse> {
    return await this.filmsService.searchFilms(query);
  }

  @Public()
  @ApiOperation({ summary: "Получить профессии фильма" })
  @ApiResponse({ status: 200, description: "Список профессий фильма" })
  @Get("/:id/professions")
  async getFilmProfessions(@Param("id") id: number): Promise<TProfessionItemResponse[]> {
    return await this.filmsService.getFilmProfessions({ filmId: id });
  }

  @Public()
  @ApiOperation({ summary: "Получить персон фильма по профессии с пагинацией" })
  @ApiResponse({ status: 200, description: "Список персон профессии" })
  @ApiQuery({ name: "profession", required: true, description: "Название профессии" })
  @ApiQuery({ name: "page", required: false, description: "Номер страницы", type: Number })
  @ApiQuery({ name: "limit", required: false, description: "Количество элементов на странице", type: Number })
  @Get("/:id/persons-by-profession")
  async getFilmPersonsByProfession(
    @Param("id") filmId: number,
    @Query("profession") profession: string,
    @Query("page") page?: string,
    @Query("limit") limit?: string
  ): Promise<TPaginatedPersonsResponse> {
    const request: TGetFilmPersonsByProfessionRequest = {
      filmId,
      profession,
      page: page !== undefined && !isNaN(Number(page)) ? Number(page) : undefined,
      limit: limit !== undefined && !isNaN(Number(limit)) ? Number(limit) : undefined,
    };
    return await this.filmsService.getFilmPersonsByProfession(request);
  }
}
