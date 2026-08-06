import type {
  TFiltersResponse,
  TQuickFiltersResponse,
} from "@common/types";

import {
  Controller,
  Get,
  Query,
  UseGuards,
  ValidationPipe,
} from "@nestjs/common";
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";

import { JwtAuthGuard, Public } from "../../shared";
import { FiltersResponseDto, GetFiltersQueryDto } from "../dto";
import { FiltersService } from "../services";

@ApiTags("Filters")
@Controller("filters")
@UseGuards(JwtAuthGuard)
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
  @ApiOkResponse({
    description: "Жанры, страны и годы для quick filters",
    type: FiltersResponseDto,
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
  @ApiOkResponse({
    description: "Доступные фильтры",
    type: FiltersResponseDto,
  })
  @Get()
  async getFilters(
    @Query(new ValidationPipe({ transform: true }))
    query: GetFiltersQueryDto
  ): Promise<TFiltersResponse> {
    return this.filtersService.getFilters(query.locale);
  }
}
