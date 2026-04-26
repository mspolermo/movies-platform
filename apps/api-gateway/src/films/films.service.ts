import type {
  TGetFilmPersonsByProfessionRequest,
  TGetFilmProfessionsRequest,
  TSearchFilmsParams,
  TFilmDetailsResponse,
  TFilmsResponse,
  TPaginatedPersonsResponse,
  TProfessionItemResponse,
} from "@common/types";

import { Injectable, NotFoundException } from "@nestjs/common";

import { kinoDbRpc } from "@common/messaging";

import { RmqService } from "../shared/rmq/rmq.service";

@Injectable()
export class FilmsService {
  constructor(private readonly rmq: RmqService) {}

  async ping(): Promise<boolean> {
    await this.rmq.sendToFilms("health.ping", {});
    return true;
  }

  async getFilmById(id: number): Promise<TFilmDetailsResponse> {
    const film = await this.rmq.sendToFilms<TFilmDetailsResponse | null>(
      kinoDbRpc.films.getById,
      id
    );

    if (!film) {
      throw new NotFoundException(`Film with id ${id} not found`);
    }

    return film;
  }

  async searchFilms(filters: TSearchFilmsParams): Promise<TFilmsResponse> {
    return this.rmq.sendToFilms<TFilmsResponse>(
      kinoDbRpc.films.filters,
      filters
    );
  }

  async getFilmProfessions(params: TGetFilmProfessionsRequest): Promise<TProfessionItemResponse[]> {
    return this.rmq.sendToFilms<TProfessionItemResponse[]>(
      kinoDbRpc.films.getFilmProfessions,
      params.filmId
    );
  }

  async getFilmPersonsByProfession(
    request: TGetFilmPersonsByProfessionRequest
  ): Promise<TPaginatedPersonsResponse> {
    return this.rmq.sendToFilms(kinoDbRpc.films.getFilmPersonsByProfession, {
      filmId: request.filmId,
      professionName: request.profession,
      page: request.page,
      limit: request.limit,
    });
  }
}
