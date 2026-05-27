import type {
  TCountryItemResponse,
  TGenreItemResponse,
} from "@common/types";

import { Injectable } from "@nestjs/common";

import { kinoDbRpc, RmqService } from "@common/services";

@Injectable()
export class FiltersClient {
  constructor(private readonly rmq: RmqService) {}

  getAllGenres(): Promise<TGenreItemResponse[]> {
    return this.rmq.sendToFilms(
      kinoDbRpc.genres.getAll,
      {}
    );
  }

  getAllCountries(): Promise<TCountryItemResponse[]> {
    return this.rmq.sendToFilms(
      kinoDbRpc.countries.getAll,
      {}
    );
  }

  getAllFilmYears(): Promise<number[]> {
    return this.rmq.sendToFilms(
      kinoDbRpc.films.getAllFilmYears,
      {}
    );
  }
}

