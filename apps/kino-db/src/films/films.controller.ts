import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { FilmsService } from "./films.service";
import type { TFilmSortBy } from "@common/types";

@Controller("films")
export class FilmsController {
  constructor(private readonly filmService: FilmsService) {}

  @MessagePattern("getFilmById")
  async getFilmById(@Payload() id: number) {
    return await this.filmService.getFilmById(id);
  }

  @MessagePattern("filters")
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
      year?: number;
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
      year,
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
      year
    );
  }

  @MessagePattern("getAllFilmYears")
  async getAllFilmYears() {
    return await this.filmService.getAllFilmYears();
  }

  @MessagePattern("searchFilmsByName")
  async searchFilmsByName(@Payload() name: string) {
    return await this.filmService.searchFilmsByName(name);
  }

  @MessagePattern("getFilmProfessions")
  async getFilmProfessions(@Payload() filmId: number) {
    return await this.filmService.getFilmProfessions(filmId);
  }

  @MessagePattern("getFilmPersonsByProfession")
  async getFilmPersonsByProfession(
    @Payload() data: { filmId: number; professionName: string; page?: number; limit?: number }
  ) {
    const { filmId, professionName, page = 1, limit = 20 } = data;
    return await this.filmService.getFilmPersonsByProfession(filmId, professionName, page, limit);
  }
}
