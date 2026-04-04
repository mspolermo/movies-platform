import type { TFiltersResponse, TQuickFiltersResponse } from "@common/types";

import { Controller, Get, Query, ValidationPipe } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from "@nestjs/swagger";

import { Public } from "../shared/guards";

import { GetFiltersQueryDto } from "./dto";
import { FiltersService } from "./filters.service";

@Controller("filters")
@ApiBearerAuth()
export class FiltersController {
  constructor(private readonly filtersService: FiltersService) {}

  @Public()
  @ApiOperation({ summary: "Быстрые фильтры (dropdown Header): урезанный payload" })
  @ApiQuery({
    name: "locale",
    required: false,
    enum: ["ru", "en"],
    description: "Локаль подписей жанров и стран (по умолчанию ru)",
  })
  @ApiResponse({ status: 200, description: "Жанры, страны и годы для quick filters" })
  @Get("quick")
  async getQuickFilters(
    @Query(new ValidationPipe({ transform: true })) query: GetFiltersQueryDto
  ): Promise<TQuickFiltersResponse> {
    return await this.filtersService.getQuickFilters(query.locale);
  }

  @Public()
  @ApiOperation({ summary: "Фильтры для поиска (полные списки)" })
  @ApiQuery({
    name: "locale",
    required: false,
    enum: ["ru", "en"],
    description: "Локаль подписей жанров и стран (по умолчанию ru)",
  })
  @ApiResponse({ status: 200, description: "Доступные фильтры" })
  @Get()
  async getFilters(
    @Query(new ValidationPipe({ transform: true })) query: GetFiltersQueryDto
  ): Promise<TFiltersResponse> {
    return await this.filtersService.getFilters(query.locale);
  }
}
