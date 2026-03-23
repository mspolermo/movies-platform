import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TFilmFilters } from "./interfaces";
import { UpdateFilmDto } from "@common/dto";
import {
  TFilmDetailsResponse,
  TFilmFiltersListPayload,
  TFilmsResponse,
  TPaginatedPersonsResponse,
  TFilmBased,
  TProfessionBased,
} from "@common/types";
import { BaseMicroserviceService } from "../shared/services";

@Injectable()
export class FilmsService extends BaseMicroserviceService {
  constructor(configService: ConfigService) {
    super(configService, "Films Service");
  }

  async getFilmById(id: number): Promise<TFilmDetailsResponse> {
    const film = await this.sendMessage<TFilmDetailsResponse | null>(
      "getFilmById",
      id
    );

    if (!film) {
      throw new NotFoundException(`Film with id ${id} not found`);
    }

    return film;
  }

  async updateFilm(id: number, dto: UpdateFilmDto): Promise<TFilmBased> {
    return this.sendMessage("updateFilm", { id, dto });
  }

  async deleteFilmById(id: number): Promise<boolean> {
    return this.sendMessage("deleteFilmById", id);
  }

  async searchFilms(filters: TFilmFilters): Promise<TFilmsResponse> {
    const { films, total } = await this.sendMessage<TFilmFiltersListPayload>(
      "filters",
      filters
    );
    const page = filters.page || 1;
    const perPage = filters.perPage || 20;

    return {
      films,
      total,
      page,
      perPage,
      hasMore: page * perPage < total,
    };
  }

  async getFilmProfessions(filmId: number): Promise<TProfessionBased[]> {
    return this.sendMessage("getFilmProfessions", filmId);
  }

  async getFilmPersonsByProfession(
    filmId: number,
    professionName: string,
    page?: number,
    limit?: number
  ): Promise<TPaginatedPersonsResponse> {
    return this.sendMessage("getFilmPersonsByProfession", {
      filmId,
      professionName,
      page,
      limit,
    });
  }
}
