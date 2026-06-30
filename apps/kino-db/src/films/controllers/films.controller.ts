import type { TGetFilmPersonsByProfessionRequest } from "@common/types";

import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

import { kinoDbRpc } from "@common/services";

import { FilmFiltersDto } from "../dto";
import { FilmsService } from "../services";

@Controller("films")
export class FilmsController {
  constructor(private readonly filmService: FilmsService) {}

  @MessagePattern(kinoDbRpc.films.getById)
  async getFilmById(@Payload() id: number) {
    return await this.filmService.getFilmById(id);
  }

  @MessagePattern(kinoDbRpc.films.filters)
  filters(@Payload() dto: FilmFiltersDto) {
    return this.filmService.filmFilters(dto);
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
