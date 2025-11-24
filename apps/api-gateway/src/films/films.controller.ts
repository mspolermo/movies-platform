import {
  Controller,
  Get,
  Param,
  Patch,
  Delete,
  Query,
  Body,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { FilmsService } from "./films.service";
import { SearchFilmsDto } from "./dto";
import { Roles, RolesGuard, JwtAuthGuard, Public } from "../shared/guards";
import { UpdateFilmDto } from "@common/dto";

@Controller("films")
@UseGuards(JwtAuthGuard) // Защищаем весь контроллер
@ApiBearerAuth()
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Public()
  @ApiOperation({ summary: "Получение фильма по id" })
  @ApiResponse({ status: 200, description: "Информация о фильме" })
  @Get("/:id")
  async getFilmById(@Param("id") id: number) {
    return await this.filmsService.getFilmById(id);
  }

  @Public()
  @ApiOperation({ summary: "Поиск фильмов" })
  @ApiResponse({ status: 200, description: "Список фильмов" })
  @Get()
  async searchFilms(
    @Query(new ValidationPipe({ transform: true })) query: SearchFilmsDto
  ) {
    return await this.filmsService.searchFilms(query);
  }

  @ApiOperation({ summary: "Изменение фильма" })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden - Admin only" })
  @UseGuards(RolesGuard)
  @Roles("ADMIN")
  @Patch("/:id")
  async updateFilm(@Param("id") id: number, @Body() dto: UpdateFilmDto) {
    return await this.filmsService.updateFilm(id, dto);
  }

  @ApiOperation({ summary: "Удаление фильма" })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Forbidden - Admin only" })
  @UseGuards(RolesGuard)
  @Roles("ADMIN")
  @Delete("/:id")
  async deleteFilmById(@Param("id") id: number) {
    return await this.filmsService.deleteFilmById(id);
  }

  @Public()
  @ApiOperation({ summary: "Получить профессии фильма" })
  @ApiResponse({ status: 200, description: "Список профессий фильма" })
  @Get("/:id/professions")
  async getFilmProfessions(@Param("id") id: number) {
    return await this.filmsService.getFilmProfessions(id);
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
  ) {
    const parsedPage = page !== undefined && !isNaN(Number(page)) ? Number(page) : undefined;
    const parsedLimit = limit !== undefined && !isNaN(Number(limit)) ? Number(limit) : undefined;

    return await this.filmsService.getFilmPersonsByProfession(
      filmId,
      profession,
      parsedPage,
      parsedLimit
    );
  }
}
