import type { TGenresListResponse } from "@common/types";

import { Injectable } from "@nestjs/common";

import { GenresClient } from "../clients";

@Injectable()
export class GenresService {
  constructor(
    private readonly genresClient: GenresClient
  ) {}

  getAllGenres(): Promise<TGenresListResponse> {
    return this.genresClient.getAllGenres();
  }
}