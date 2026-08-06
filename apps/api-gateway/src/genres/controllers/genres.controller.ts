import type { TGenresListResponse } from "@common/types";

import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { JwtAuthGuard, Public } from "../../shared";
import { GenreItemResponseDto } from "../dto";
import { GenresService } from "../services";

@ApiTags("Genres")
@Controller("genres")
@UseGuards(JwtAuthGuard)
export class GenresController {
  constructor(
    private readonly genresService: GenresService
  ) {}

  @Public()
  @Get()
  @ApiOperation({ summary: "Получение всех жанров" })
  @ApiOkResponse({
    description: "Список жанров (`nameRu` / `nameEn`)",
    type: GenreItemResponseDto,
    isArray: true,
  })
  getAllGenres(): Promise<TGenresListResponse> {
    return this.genresService.getAllGenres();
  }
}
