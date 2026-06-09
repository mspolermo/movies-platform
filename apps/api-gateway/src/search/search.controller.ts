import type { TSearchResultResponse } from "@common/types";

import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";

import { JwtAuthGuard, Public } from "../shared/guards";

import { SearchService } from "./search.service";

@Controller("search")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Public()
  @ApiOperation({ summary: "Поиск по части имени" })
  @ApiResponse({ status: 200, description: "Результаты поиска" })
  @Get()
  async search(@Query("name") name?: string): Promise<TSearchResultResponse> {
    try {
      return await this.searchService.searchByName(name);;
    } catch (error) {
      throw error;
    }
  }
}
