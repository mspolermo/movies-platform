import type { TFiltersResponse, TQuickFiltersResponse } from "@common/types";

import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";

import { Public } from "../shared/guards";

import { FiltersService } from "./filters.service";

@Controller("filters")
@ApiBearerAuth()
export class FiltersController {
  constructor(private readonly filtersService: FiltersService) {}

  @Public()
  @ApiOperation({ summary: "Быстрые фильтры (dropdown Header): урезанный payload" })
  @ApiResponse({ status: 200, description: "Жанры, страны и годы для quick filters" })
  @Get("quick")
  async getQuickFilters(): Promise<TQuickFiltersResponse> {
    return await this.filtersService.getQuickFilters();
  }

  @Public()
  @ApiOperation({ summary: "Фильтры для поиска (полные списки)" })
  @ApiResponse({ status: 200, description: "Доступные фильтры" })
  @Get()
  async getFilters(): Promise<TFiltersResponse> {
    return await this.filtersService.getFilters();
  }
}
