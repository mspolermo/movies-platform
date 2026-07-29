import type {
  TAdminCountriesListResponse,
  TCountryAdminItemResponse,
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

import {
  AdminListQueryDto,
  CreateCountryDto,
  UpdateCountryDto,
} from "@common/dto";

import { JwtAuthGuard, Roles, RolesGuard } from "../../shared";
import { AdminCountriesService } from "../services";

/** Admin CRUD стран; только роль ADMIN (ADR-005). */
@Controller("admin/countries")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
@ApiBearerAuth()
export class AdminCountriesController {
  constructor(private readonly adminCountriesService: AdminCountriesService) {}

  @ApiOperation({ summary: "Список стран (пагинация, с id)" })
  @ApiResponse({ status: 200, description: "Пагинированный список стран" })
  @Get()
  listCountries(
    @Query() query: AdminListQueryDto
  ): Promise<TAdminCountriesListResponse> {
    return this.adminCountriesService.listCountries(query);
  }

  @ApiOperation({ summary: "Создание страны" })
  @ApiResponse({ status: 201, description: "Созданная страна" })
  @ApiResponse({ status: 409, description: "Дубликат названия" })
  @Post()
  createCountry(
    @Body() dto: CreateCountryDto
  ): Promise<TCountryAdminItemResponse> {
    return this.adminCountriesService.createCountry(dto);
  }

  @ApiOperation({ summary: "Частичное обновление страны" })
  @ApiResponse({ status: 200, description: "Обновлённая страна" })
  @ApiResponse({ status: 404, description: "Не найдена" })
  @ApiResponse({ status: 409, description: "Дубликат названия" })
  @Patch("/:id")
  updateCountry(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateCountryDto
  ): Promise<TCountryAdminItemResponse> {
    return this.adminCountriesService.updateCountry(id, dto);
  }

  @ApiOperation({ summary: "Удаление страны (Restrict при привязке к фильмам)" })
  @ApiResponse({ status: 200, description: "Удалено" })
  @ApiResponse({ status: 409, description: "Страна привязана к фильмам" })
  @Delete("/:id")
  deleteCountry(@Param("id", ParseIntPipe) id: number): Promise<true> {
    return this.adminCountriesService.deleteCountry(id);
  }
}
