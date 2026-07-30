import type {
  TAdminGenresListResponse,
  TAdminGenreItemResponse,
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

import { AdminListQueryDto, CreateGenreDto, UpdateGenreDto } from "@common/dto";

import { JwtAuthGuard, Roles, RolesGuard } from "../../shared";
import { AdminGenresService } from "../services";

/** Admin CRUD жанров; только роль ADMIN (ADR-005). */
@Controller("admin/genres")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
@ApiBearerAuth()
export class AdminGenresController {
  constructor(private readonly adminGenresService: AdminGenresService) {}

  @ApiOperation({ summary: "Список жанров (пагинация + поиск q)" })
  @ApiResponse({ status: 200, description: "Пагинированный список жанров" })
  @Get()
  listGenres(
    @Query() query: AdminListQueryDto
  ): Promise<TAdminGenresListResponse> {
    return this.adminGenresService.listGenres(query);
  }

  @ApiOperation({ summary: "Создание жанра" })
  @ApiResponse({ status: 201, description: "Созданный жанр" })
  @ApiResponse({ status: 409, description: "Дубликат названия" })
  @Post()
  createGenre(@Body() dto: CreateGenreDto): Promise<TAdminGenreItemResponse> {
    return this.adminGenresService.createGenre(dto);
  }

  @ApiOperation({ summary: "Частичное обновление жанра" })
  @ApiResponse({ status: 200, description: "Обновлённый жанр" })
  @ApiResponse({ status: 404, description: "Не найден" })
  @ApiResponse({ status: 409, description: "Дубликат названия" })
  @Patch("/:id")
  updateGenre(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateGenreDto
  ): Promise<TAdminGenreItemResponse> {
    return this.adminGenresService.updateGenre(id, dto);
  }

  @ApiOperation({ summary: "Удаление жанра (Restrict при привязке к фильмам)" })
  @ApiResponse({ status: 200, description: "Удалено" })
  @ApiResponse({ status: 409, description: "Жанр привязан к фильмам" })
  @Delete("/:id")
  deleteGenre(@Param("id", ParseIntPipe) id: number): Promise<true> {
    return this.adminGenresService.deleteGenre(id);
  }
}
