import type {
  TAdminCountriesListResponse,
  TAdminFilmItemResponse,
  TAdminFilmsListResponse,
  TAdminGenresListResponse,
  TAdminListRequest,
  TAdminPersonsListResponse,
  TAdminProfessionsListResponse,
  TAdminCountryItemResponse,
  TCreateCountryRequest,
  TCreateFilmRequest,
  TCreateGenreRequest,
  TCreatePersonRequest,
  TCreateProfessionRequest,
  TAdminGenreItemResponse,
  TAdminPersonItemResponse,
  TAdminProfessionItemResponse,
  TUpdateCountryRequest,
  TUpdateFilmRequest,
  TUpdateGenreRequest,
  TUpdatePersonRequest,
  TUpdateProfessionRequest,
} from "@common/types";

import { Injectable } from "@nestjs/common";

import { kinoDbRpc, RmqService } from "@common/services";

@Injectable()
export class AdminKinoDbClient {
  constructor(private readonly rmq: RmqService) {}

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

  listGenres(request: TAdminListRequest): Promise<TAdminGenresListResponse> {
    return this.rmq.sendToFilms(kinoDbRpc.admin.genres.list, request);
  }

  createGenre(dto: TCreateGenreRequest): Promise<TAdminGenreItemResponse> {
    return this.rmq.sendToFilms(kinoDbRpc.admin.genres.create, dto);
  }

  updateGenre(
    id: number,
    data: TUpdateGenreRequest
  ): Promise<TAdminGenreItemResponse> {
    return this.rmq.sendToFilms(kinoDbRpc.admin.genres.update, { id, data });
  }

  deleteGenre(id: number): Promise<true> {
    return this.rmq.sendToFilms(kinoDbRpc.admin.genres.delete, id);
  }

  listCountries(
    request: TAdminListRequest
  ): Promise<TAdminCountriesListResponse> {
    return this.rmq.sendToFilms(kinoDbRpc.admin.countries.list, request);
  }

  createCountry(dto: TCreateCountryRequest): Promise<TAdminCountryItemResponse> {
    return this.rmq.sendToFilms(kinoDbRpc.admin.countries.create, dto);
  }

  updateCountry(
    id: number,
    data: TUpdateCountryRequest
  ): Promise<TAdminCountryItemResponse> {
    return this.rmq.sendToFilms(kinoDbRpc.admin.countries.update, { id, data });
  }

  deleteCountry(id: number): Promise<true> {
    return this.rmq.sendToFilms(kinoDbRpc.admin.countries.delete, id);
  }

  listProfessions(
    request: TAdminListRequest
  ): Promise<TAdminProfessionsListResponse> {
    return this.rmq.sendToFilms(kinoDbRpc.admin.professions.list, request);
  }

  createProfession(
    dto: TCreateProfessionRequest
  ): Promise<TAdminProfessionItemResponse> {
    return this.rmq.sendToFilms(kinoDbRpc.admin.professions.create, dto);
  }

  updateProfession(
    id: number,
    data: TUpdateProfessionRequest
  ): Promise<TAdminProfessionItemResponse> {
    return this.rmq.sendToFilms(kinoDbRpc.admin.professions.update, {
      id,
      data,
    });
  }

  deleteProfession(id: number): Promise<true> {
    return this.rmq.sendToFilms(kinoDbRpc.admin.professions.delete, id);
  }

  listPersons(request: TAdminListRequest): Promise<TAdminPersonsListResponse> {
    return this.rmq.sendToFilms(kinoDbRpc.admin.persons.list, request);
  }

  getPersonById(id: number): Promise<TAdminPersonItemResponse> {
    return this.rmq.sendToFilms(kinoDbRpc.admin.persons.getById, id);
  }

  createPerson(dto: TCreatePersonRequest): Promise<TAdminPersonItemResponse> {
    return this.rmq.sendToFilms(kinoDbRpc.admin.persons.create, dto);
  }

  updatePerson(
    id: number,
    data: TUpdatePersonRequest
  ): Promise<TAdminPersonItemResponse> {
    return this.rmq.sendToFilms(kinoDbRpc.admin.persons.update, { id, data });
  }

  deletePerson(id: number): Promise<true> {
    return this.rmq.sendToFilms(kinoDbRpc.admin.persons.delete, id);
  }
}
