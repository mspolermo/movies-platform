import type { TGenresListResponse } from "@common/types";

import { Injectable } from "@nestjs/common";

import {
  kinoDbRpc,
  RmqService,
} from "@common/services";

@Injectable()
export class GenresClient {
  constructor(
    private readonly rmq: RmqService
  ) {}

  getAllGenres(): Promise<TGenresListResponse> {
    return this.rmq.sendToFilms(
      kinoDbRpc.genres.getAll,
      {}
    );
  }
}