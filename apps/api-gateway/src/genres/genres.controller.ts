import type { TGenresListResponse } from "@common/types";

import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";

import { GenresService } from "./genres.service";

@Controller("genres")
@ApiBearerAuth()
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @ApiOperation({ summary: "Получение всех жанров" })
  @ApiResponse({ status: 200, description: "Список жанров" })
  @Get()
  async getAllGenres(): Promise<TGenresListResponse> {
    return await this.genresService.getAllGenres();
  }
}
