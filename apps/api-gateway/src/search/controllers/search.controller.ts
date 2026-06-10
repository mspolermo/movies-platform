import type { TSearchResultResponse } from "@common/types";

import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from "@nestjs/swagger";

import { JwtAuthGuard, Public } from "../../shared/guards";
import { SearchService } from "../services/search.service";

@Controller("search")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SearchController {
  constructor(
    private readonly searchService: SearchService,
  ) {}

  @Public()
  @ApiOperation({
    summary: "Поиск фильмов и персон по имени",
  })
  @ApiResponse({
    status: 200,
    description: "Результаты поиска",
  })
  @ApiQuery({
    name: "name",
    required: false,
    example: "Нолан",
  })
  @Get()
  async search(
    @Query("name") name?: string,
  ): Promise<TSearchResultResponse> {
    return this.searchService.searchByName(name);
  }
}