import type {
  TSearchResultResponse,
} from "@common/types";

import { Injectable } from "@nestjs/common";

import { RmqService, kinoDbRpc } from "@common/services";

@Injectable()
export class SearchService {
  constructor(private readonly rmq: RmqService) {}

  async searchByName(name?: string): Promise<TSearchResultResponse> {
    const searchName = name ?? "";

    const [films, persons] = await Promise.all([
      this.rmq.sendToFilms(
        kinoDbRpc.films.searchFilmsByName,
        searchName
      ),
      this.rmq.sendToFilms(
        kinoDbRpc.persons.findByNameAndProfession,
        { name: searchName }
      ),
    ]);

    return { films, persons };
  }
}