import type {
  TAdminFilmItemResponse,
  TAdminFilmsListResponse,
} from "@common/types";

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";

import { AdminListQueryDto, CreateFilmDto, UpdateFilmDto } from "@common/dto";

import { JwtAuthGuard, Roles, RolesGuard } from "../../shared";
import { AdminFilmsService } from "../services";

@Controller("admin/films")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
@ApiBearerAuth()
export class AdminFilmsController {
  constructor(private readonly adminFilmsService: AdminFilmsService) {}

  @ApiOperation({ summary: "Список фильмов (пагинация + поиск q)" })
  @ApiResponse({ status: 200, description: "Пагинированный список фильмов" })
  @Get()
  listFilms(@Query() query: AdminListQueryDto): Promise<TAdminFilmsListResponse> {
    return this.adminFilmsService.listFilms(query);
  }

  @ApiOperation({ summary: "Фильм по id" })
  @ApiResponse({ status: 200, description: "Фильм" })
  @ApiResponse({ status: 404, description: "Не найден" })
  @Get("/:id")
  getFilmById(
    @Param("id", ParseIntPipe) id: number
  ): Promise<TAdminFilmItemResponse> {
    return this.adminFilmsService.getFilmById(id);
  }

  @ApiOperation({ summary: "Создание фильма" })
  @ApiResponse({ status: 201, description: "Созданный фильм" })
  @Post()
  createFilm(@Body() dto: CreateFilmDto): Promise<TAdminFilmItemResponse> {
    return this.adminFilmsService.createFilm(dto);
  }

  @ApiOperation({ summary: "Частичное обновление фильма (null — очистить поле)" })
  @ApiResponse({ status: 200, description: "Обновлённый фильм" })
  @ApiResponse({ status: 404, description: "Не найден" })
  @Patch("/:id")
  updateFilm(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateFilmDto
  ): Promise<TAdminFilmItemResponse> {
    return this.adminFilmsService.updateFilm(id, dto);
  }

  @ApiOperation({ summary: "Удаление фильма (каскад join-строк и комментариев)" })
  @ApiResponse({ status: 200, description: "Удалено" })
  @ApiResponse({ status: 404, description: "Не найден" })
  @Delete("/:id")
  deleteFilm(@Param("id", ParseIntPipe) id: number): Promise<true> {
    return this.adminFilmsService.deleteFilm(id);
  }
}
