import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { FilmFilters } from "./interfaces";
import { UpdateFilmDto } from "@common/dto";
import { TFilmBased, TProfessionBased, PaginatedPersonsResponse } from "@common/types";
import { BaseMicroserviceService } from "../shared/services";

@Injectable()
export class FilmsService extends BaseMicroserviceService {
  constructor(configService: ConfigService) {
    super(configService, "Films Service");
  }

  async getFilmById(id: number): Promise<TFilmBased> {
    return this.sendMessage("getFilmById", id);
  }

  async updateFilm(id: number, dto: UpdateFilmDto): Promise<TFilmBased> {
    return this.sendMessage("updateFilm", { id, dto });
  }

  async deleteFilmById(id: number): Promise<boolean> {
    return this.sendMessage("deleteFilmById", id);
  }

  async searchFilms(filters: FilmFilters): Promise<TFilmBased[]> {
    return this.sendMessage("filters", filters);
  }

  async getFilmProfessions(filmId: number): Promise<TProfessionBased[]> {
    return this.sendMessage("getFilmProfessions", filmId);
  }

  async getFilmPersonsByProfession(
    filmId: number,
    professionName: string,
    page?: number,
    limit?: number
  ): Promise<PaginatedPersonsResponse> {
    return this.sendMessage("getFilmPersonsByProfession", {
      filmId,
      professionName,
      page,
      limit,
    });
  }
}
