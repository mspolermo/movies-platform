import type {
  TSearchResultResponse,
  TFilmListItemResponse,
  TPersonListItemResponse,
} from "@common/types";

import { Injectable } from "@nestjs/common";

import { kinoDbRpc } from "@common/messaging";

import { RmqService } from "../shared/rmq/rmq.service";

@Injectable()
export class SearchService {
  constructor(private readonly rmq: RmqService) {}

  async searchByName(name?: string): Promise<TSearchResultResponse> {
    const searchName = name ?? "";

    const [films, persons] = await Promise.all([
      this.rmq.sendToFilms<TFilmListItemResponse[]>(
        kinoDbRpc.films.searchFilmsByName,
        searchName
      ),
      this.rmq.sendToFilms<TPersonListItemResponse[]>(
        kinoDbRpc.persons.searchByName,
        searchName
      ),
    ]);

    return { films, persons };
  }
}