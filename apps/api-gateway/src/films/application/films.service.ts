import type {
  TFilmDetailsResponse,
  TFilmsResponse,
  TGetFilmPersonsByProfessionRequest,
  TGetFilmProfessionsRequest,
  TPaginatedPersonsResponse,
  TProfessionItemResponse,
  TSearchFilmsParams,
} from "@common/types";

import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { FilmsClient } from "../clients";

@Injectable()
export class FilmsService {
  constructor(
    private readonly filmsClient: FilmsClient
  ) {}

  async ping(): Promise<boolean> {
    return this.filmsClient.ping();
  }

  async getFilmById(
    id: number
  ): Promise<TFilmDetailsResponse> {
    const film = await this.filmsClient.getFilmById(id);

    if (!film) {
      throw new NotFoundException(
        `Film with id ${id} not found`
      );
    }

    return film;
  }

  searchFilms(
    filters: TSearchFilmsParams
  ): Promise<TFilmsResponse> {
    return this.filmsClient.searchFilms(filters);
  }

  getFilmProfessions(
    params: TGetFilmProfessionsRequest
  ): Promise<TProfessionItemResponse[]> {
    return this.filmsClient.getFilmProfessions(
      params.filmId
    );
  }

  getFilmPersonsByProfession(
    request: TGetFilmPersonsByProfessionRequest
  ): Promise<TPaginatedPersonsResponse> {
    return this.filmsClient.getFilmPersonsByProfession(
      request
    );
  }
}