import type {
  TAdminCountriesListResponse,
  TAdminFilmItemResponse,
  TAdminFilmsListResponse,
  TAdminGenresListResponse,
  TAdminListRequest,
  TAdminPersonsListResponse,
  TAdminProfessionsListResponse,
  TCountryAdminItemResponse,
  TCreateCountryRequest,
  TCreateFilmRequest,
  TCreateGenreRequest,
  TCreatePersonRequest,
  TCreateProfessionRequest,
  TGenreAdminItemResponse,
  TPersonAdminItemResponse,
  TProfessionAdminItemResponse,
  TUpdateCountryRequest,
  TUpdateFilmRequest,
  TUpdateGenreRequest,
  TUpdatePersonRequest,
  TUpdateProfessionRequest,
} from "@common/types";

import { Injectable } from "@nestjs/common";

import { kinoDbRpc, RmqService } from "@common/services";

/** RMQ-клиент admin-операций kino-db (films/genres/countries/professions/persons). */
@Injectable()
export class AdminKinoDbClient {
  constructor(private readonly rmq: RmqService) {}

  // --- films ---

  listFilms(request: TAdminListRequest): Promise<TAdminFilmsListResponse> {
    return this.rmq.sendToFilms(kinoDbRpc.admin.films.list, request);
  }

  getFilmById(id: number): Promise<TAdminFilmItemResponse> {
    return this.rmq.sendToFilms(kinoDbRpc.admin.films.getById, id);
  }

  createFilm(dto: TCreateFilmRequest): Promise<TAdminFilmItemResponse> {
    return this.rmq.sendToFilms(kinoDbRpc.admin.films.create, dto);
  }

  updateFilm(
    id: number,
    data: TUpdateFilmRequest
  ): Promise<TAdminFilmItemResponse> {
    return this.rmq.sendToFilms(kinoDbRpc.admin.films.update, { id, data });
  }

  deleteFilm(id: number): Promise<true> {
    return this.rmq.sendToFilms(kinoDbRpc.admin.films.delete, id);
  }

  // --- genres ---

  listGenres(request: TAdminListRequest): Promise<TAdminGenresListResponse> {
    return this.rmq.sendToFilms(kinoDbRpc.admin.genres.list, request);
  }

  createGenre(dto: TCreateGenreRequest): Promise<TGenreAdminItemResponse> {
    return this.rmq.sendToFilms(kinoDbRpc.admin.genres.create, dto);
  }

  updateGenre(
    id: number,
    data: TUpdateGenreRequest
  ): Promise<TGenreAdminItemResponse> {
    return this.rmq.sendToFilms(kinoDbRpc.admin.genres.update, { id, data });
  }

  deleteGenre(id: number): Promise<true> {
    return this.rmq.sendToFilms(kinoDbRpc.admin.genres.delete, id);
  }

  // --- countries ---

  listCountries(
    request: TAdminListRequest
  ): Promise<TAdminCountriesListResponse> {
    return this.rmq.sendToFilms(kinoDbRpc.admin.countries.list, request);
  }

  createCountry(dto: TCreateCountryRequest): Promise<TCountryAdminItemResponse> {
    return this.rmq.sendToFilms(kinoDbRpc.admin.countries.create, dto);
  }

  updateCountry(
    id: number,
    data: TUpdateCountryRequest
  ): Promise<TCountryAdminItemResponse> {
    return this.rmq.sendToFilms(kinoDbRpc.admin.countries.update, { id, data });
  }

  deleteCountry(id: number): Promise<true> {
    return this.rmq.sendToFilms(kinoDbRpc.admin.countries.delete, id);
  }

  // --- professions ---

  listProfessions(
    request: TAdminListRequest
  ): Promise<TAdminProfessionsListResponse> {
    return this.rmq.sendToFilms(kinoDbRpc.admin.professions.list, request);
  }

  createProfession(
    dto: TCreateProfessionRequest
  ): Promise<TProfessionAdminItemResponse> {
    return this.rmq.sendToFilms(kinoDbRpc.admin.professions.create, dto);
  }

  updateProfession(
    id: number,
    data: TUpdateProfessionRequest
  ): Promise<TProfessionAdminItemResponse> {
    return this.rmq.sendToFilms(kinoDbRpc.admin.professions.update, {
      id,
      data,
    });
  }

  deleteProfession(id: number): Promise<true> {
    return this.rmq.sendToFilms(kinoDbRpc.admin.professions.delete, id);
  }

  // --- persons ---

  listPersons(request: TAdminListRequest): Promise<TAdminPersonsListResponse> {
    return this.rmq.sendToFilms(kinoDbRpc.admin.persons.list, request);
  }

  getPersonById(id: number): Promise<TPersonAdminItemResponse> {
    return this.rmq.sendToFilms(kinoDbRpc.admin.persons.getById, id);
  }

  createPerson(dto: TCreatePersonRequest): Promise<TPersonAdminItemResponse> {
    return this.rmq.sendToFilms(kinoDbRpc.admin.persons.create, dto);
  }

  updatePerson(
    id: number,
    data: TUpdatePersonRequest
  ): Promise<TPersonAdminItemResponse> {
    return this.rmq.sendToFilms(kinoDbRpc.admin.persons.update, { id, data });
  }

  deletePerson(id: number): Promise<true> {
    return this.rmq.sendToFilms(kinoDbRpc.admin.persons.delete, id);
  }
}
