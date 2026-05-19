import type {
  TFilmDetailsResponse,
  TFilmsResponse,
  TGetFilmPersonsByProfessionRequest,
  TPaginatedPersonsResponse,
  TProfessionItemResponse,
  TSearchFilmsParams,
} from "@common/types";

import { Injectable } from "@nestjs/common";

import { kinoDbRpc, RmqService } from "@common/services";

@Injectable()
export class FilmsClient {
  constructor(
    private readonly rmq: RmqService
  ) {}

  ping(): Promise<boolean> {
    return this.rmq.sendToFilms(
      kinoDbRpc.health.ping, {}
    );
  }

  getFilmById(
    id: number
  ): Promise<TFilmDetailsResponse | null> {
    return this.rmq.sendToFilms(
      kinoDbRpc.films.getById,
      id
    );
  }

  searchFilms(
    filters: TSearchFilmsParams
  ): Promise<TFilmsResponse> {
    return this.rmq.sendToFilms(
      kinoDbRpc.films.filters,
      filters
    );
  }

  getFilmProfessions(
    filmId: number
  ): Promise<TProfessionItemResponse[]> {
    return this.rmq.sendToFilms(
      kinoDbRpc.films.getFilmProfessions,
      filmId
    );
  }

  getFilmPersonsByProfession(
    request: TGetFilmPersonsByProfessionRequest
  ): Promise<TPaginatedPersonsResponse> {
    return this.rmq.sendToFilms(
      kinoDbRpc.films.getFilmPersonsByProfession,
      request
    );
  }
}