import type { TGenresListResponse } from "@common/types";

import { Injectable } from "@nestjs/common";

import { kinoDbRpc } from "@common/messaging";

import { RmqService } from "../shared/rmq/rmq.service";

@Injectable()
export class GenresService {
  constructor(private readonly rmq: RmqService) {}

  async getAllGenres(): Promise<TGenresListResponse> {
    return this.rmq.sendToFilms(kinoDbRpc.genres.getAll, {});
  }
}
