import type {
  TFilmDetailsResponse,
  TFilmListItemResponse,
  TFilmsResponse,
  TGetSimilarFilmsRequest,
  TPaginatedPersonsResponse,
  TProfessionItemResponse,
} from "@common/types";

import { Injectable } from "@nestjs/common";

import { LIST_DEFAULT_LIMIT } from "@common/constants";

import { FilmFiltersDto } from "../dto";

import { FilmCastService } from "./filmCast.service";
import { FilmCatalogService } from "./filmCatalog.service";
import { FilmDetailsService } from "./filmDetails.service";
import { FilmSimilarService } from "./filmSimilar.service";

/**
 * Facade над use-case сервисами фильмов.
 * Публичный API модуля для контроллера — без смены RPC-сигнатур.
 */
@Injectable()
export class FilmsService {
  constructor(
    private readonly details: FilmDetailsService,
    private readonly catalog: FilmCatalogService,
    private readonly similar: FilmSimilarService,
    private readonly cast: FilmCastService
  ) {}

  /** @see FilmDetailsService.getFilmById */
  getFilmById(id: number): Promise<TFilmDetailsResponse | null> {
    return this.details.getFilmById(id);
  }

  /** @see FilmSimilarService.getSimilarFilms */
  getSimilarFilms(
    request: TGetSimilarFilmsRequest
  ): Promise<TFilmListItemResponse[] | null> {
    return this.similar.getSimilarFilms(request);
  }

  /** @see FilmCatalogService.searchFilmsByName */
  searchFilmsByName(name: string): Promise<TFilmListItemResponse[]> {
    return this.catalog.searchFilmsByName(name);
  }

  /** @see FilmCatalogService.filmFilters */
  filmFilters(dto: FilmFiltersDto): Promise<TFilmsResponse> {
    return this.catalog.filmFilters(dto);
  }

  /** @see FilmCatalogService.getAllFilmYears */
  getAllFilmYears(): Promise<number[]> {
    return this.catalog.getAllFilmYears();
  }

  /** @see FilmCastService.getFilmProfessions */
  getFilmProfessions(filmId: number): Promise<TProfessionItemResponse[]> {
    return this.cast.getFilmProfessions(filmId);
  }

  /** @see FilmCastService.getFilmPersonsByProfession */
  getFilmPersonsByProfession(
    filmId: number,
    professionName: string,
    page = 1,
    limit = LIST_DEFAULT_LIMIT
  ): Promise<TPaginatedPersonsResponse | null> {
    return this.cast.getFilmPersonsByProfession(
      filmId,
      professionName,
      page,
      limit
    );
  }
}
