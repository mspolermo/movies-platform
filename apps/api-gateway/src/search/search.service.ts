import type {
  TSearchResultResponse,
  TFilmListItemResponse,
  TPersonListItemResponse,
} from "@common/types";

import { Injectable } from "@nestjs/common";

import { RmqService, kinoDbRpc } from "@common/services";

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