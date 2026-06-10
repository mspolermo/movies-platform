import type {
  TSearchResultResponse,
} from "@common/types";

import { Injectable } from "@nestjs/common";

import { SearchClient } from "../clients";

@Injectable()
export class SearchService {
  constructor(
    private readonly searchClient: SearchClient,
  ) {}

  async searchByName(
    name?: string,
  ): Promise<TSearchResultResponse> {
    const searchName = name?.trim() ?? "";

    if (!searchName) {
      return {
        films: [],
        persons: [],
      };
    }

    const [films, persons] = await Promise.all([
      this.searchClient.searchFilmsByName(
        searchName,
      ),
      this.searchClient.findPersonsByName(
        searchName,
      ),
    ]);

    return {
      films,
      persons,
    };
  }
}