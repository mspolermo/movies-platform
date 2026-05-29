import type { TGenresListResponse } from "@common/types";

import {
  Controller,
  Get,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";

import { GenresService } from "../services";

@Controller("genres")
@ApiBearerAuth()
export class GenresController {
  constructor(
    private readonly genresService: GenresService
  ) {}

  @ApiOperation({
    summary: "Получение всех жанров",
  })
  @ApiResponse({
    status: 200,
    description: "Список жанров",
  })
  @Get()
  getAllGenres(): Promise<TGenresListResponse> {
    return this.genresService.getAllGenres();
  }
}