import type { TFilmSortBy } from "@common/types";
import type { TGetFilmPersonsByProfessionRequest } from "@common/types";

import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

import { kinoDbRpc } from "@common/services";

import { FilmsService } from "./films.service";

@Controller("films")
export class FilmsController {
  constructor(private readonly filmService: FilmsService) {}

  @MessagePattern(kinoDbRpc.films.getById)
  async getFilmById(@Payload() id: number) {
    return await this.filmService.getFilmById(id);
  }

  @MessagePattern(kinoDbRpc.films.filters)
  async filters(
    @Payload()
    data: {
      page: number;
      perPage: number;
      genres?: string[];
      countries?: string[];
      persons?: string[];
      minRatingKp?: number;
      minVotesKp?: number;
      sortBy?: TFilmSortBy;
      years?: number[];
    }
  ) {
    const {
      page,
      perPage,
      genres,
      countries,
      persons,
      minRatingKp,
      minVotesKp,
      sortBy,
      years,
    } = data;
    return await this.filmService.filmFilters(
      page,
      perPage,
      genres,
      countries,
      persons,
      minRatingKp,
      minVotesKp,
      sortBy,
      years
    );
  }

  @MessagePattern(kinoDbRpc.films.getAllFilmYears)
  async getAllFilmYears() {
    return await this.filmService.getAllFilmYears();
  }

  @MessagePattern(kinoDbRpc.films.searchFilmsByName)
  async searchFilmsByName(@Payload() name: string) {
    return await this.filmService.searchFilmsByName(name);
  }

  @MessagePattern(kinoDbRpc.films.getFilmProfessions)
  async getFilmProfessions(@Payload() filmId: number) {
    return await this.filmService.getFilmProfessions(filmId);
  }

  @MessagePattern(kinoDbRpc.films.getFilmPersonsByProfession)
  async getFilmPersonsByProfession(
    @Payload() data: TGetFilmPersonsByProfessionRequest
  ) {
    const { filmId, profession, page = 1, limit = 20 } = data;
    return await this.filmService.getFilmPersonsByProfession(filmId, profession, page, limit);
  }
}
