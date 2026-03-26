import type { TGenresListResponse } from "@common/types";

import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";

import { kinoDbRpc } from "@common/messaging";

import { GenresService } from "./genres.service";

@Controller("genres")
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @MessagePattern(kinoDbRpc.genres.getAll)
  async getAllGenres(): Promise<TGenresListResponse> {
    return await this.genresService.getAllGenres();
  }
}
