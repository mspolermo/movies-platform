import type { TSearchResultResponse } from "@common/types";

import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from "@nestjs/swagger";

import { JwtAuthGuard, Public } from "../../shared";
import { SearchResultResponseDto } from "../dto";
import { SearchService } from "../services/search.service";

@ApiTags("Search")
@Controller("search")
@UseGuards(JwtAuthGuard)
export class SearchController {
  constructor(
    private readonly searchService: SearchService,
  ) {}

  @Public()
  @ApiOperation({
    summary: "Поиск фильмов и персон по имени",
  })
  @ApiOkResponse({
    description: "Результаты поиска",
    type: SearchResultResponseDto,
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
