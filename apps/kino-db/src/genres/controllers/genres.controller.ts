import type { TGenresListResponse } from "@common/types";

import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";

import { kinoDbRpc } from "@common/services";

import { GenresService } from "../services";

@Controller("genres")
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @MessagePattern(kinoDbRpc.genres.getAll)
  getAllGenres(): Promise<TGenresListResponse> {
    return this.genresService.getAllGenres();
  }
}
