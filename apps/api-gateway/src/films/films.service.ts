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
import { ConfigService } from "@nestjs/config";

import { kinoDbRpc } from "@common/messaging";

import { BaseMicroserviceService } from "../shared/services";

@Injectable()
export class FilmsService extends BaseMicroserviceService {
  constructor(configService: ConfigService) {
    super(configService, "Films Service");
  }

  async getFilmById(id: number): Promise<TFilmDetailsResponse> {
    const film = await this.sendMessage<TFilmDetailsResponse | null>(
      kinoDbRpc.films.getById,
      id
    );

    if (!film) {
      throw new NotFoundException(`Film with id ${id} not found`);
    }

    return film;
  }

  async searchFilms(filters: TSearchFilmsParams): Promise<TFilmsResponse> {
    return this.sendMessage<TFilmsResponse>(
      kinoDbRpc.films.filters,
      filters
    );
  }

  async getFilmProfessions(params: TGetFilmProfessionsRequest): Promise<TProfessionItemResponse[]> {
    return this.sendMessage<TProfessionItemResponse[]>(
      kinoDbRpc.films.getFilmProfessions,
      params.filmId
    );
  }

  async getFilmPersonsByProfession(
    request: TGetFilmPersonsByProfessionRequest
  ): Promise<TPaginatedPersonsResponse> {
    return this.sendMessage(kinoDbRpc.films.getFilmPersonsByProfession, {
      filmId: request.filmId,
      professionName: request.profession,
      page: request.page,
      limit: request.limit,
    });
  }
}
