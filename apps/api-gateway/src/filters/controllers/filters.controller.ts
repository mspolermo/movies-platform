import type {
  TFiltersResponse,
  TQuickFiltersResponse,
} from "@common/types";

import {
  Controller,
  Get,
  Query,
  ValidationPipe,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from "@nestjs/swagger";

import { Public } from "../../shared";
import { FiltersService } from "../services";
import { GetFiltersQueryDto } from "../dto";

@Controller("filters")
@ApiBearerAuth()
export class FiltersController {
  constructor(
    private readonly filtersService: FiltersService
  ) {}

  @Public()
  @ApiOperation({
    summary:
      "Быстрые фильтры (dropdown Header): урезанный payload",
  })
  @ApiQuery({
    name: "locale",
    required: false,
    enum: ["ru", "en"],
    description:
      "Локаль подписей жанров и стран (по умолчанию ru)",
  })
  @ApiResponse({
    status: 200,
    description: "Жанры, страны и годы для quick filters",
  })
  @Get("quick")
  async getQuickFilters(
    @Query(new ValidationPipe({ transform: true }))
    query: GetFiltersQueryDto
  ): Promise<TQuickFiltersResponse> {
    return this.filtersService.getQuickFilters(query.locale);
  }

  @Public()
  @ApiOperation({
    summary: "Фильтры для поиска (полные списки)",
  })
  @ApiQuery({
    name: "locale",
    required: false,
    enum: ["ru", "en"],
    description:
      "Локаль подписей жанров и стран (по умолчанию ru)",
  })
  @ApiResponse({
    status: 200,
    description: "Доступные фильтры",
  })
  @Get()
  async getFilters(
    @Query(new ValidationPipe({ transform: true }))
    query: GetFiltersQueryDto
  ): Promise<TFiltersResponse> {
    return this.filtersService.getFilters(query.locale);
  }
}

