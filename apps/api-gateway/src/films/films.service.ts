import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TFilmFilters } from "./interfaces";
import {
  TFilmDetailsResponse,
  TFilmsResponse,
  TPaginatedPersonsResponse,
  TProfessionItemResponse,
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

  async searchFilms(filters: TFilmFilters): Promise<TFilmsResponse> {
    return this.sendMessage<TFilmsResponse>(
      "filters",
      filters
    );
  }

  async getFilmProfessions(filmId: number): Promise<TProfessionItemResponse[]> {
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
