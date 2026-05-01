import type {
  TFindPersonsByNameAndProfessionRequest,
  TGetPersonByIdRequest,
  TGetPersonFilmsRequest,
  TGetPersonsRequest,
  TPaginatedPersonsResponse,
  TPersonFilmsPaginationResponse,
  TPersonListItemResponse,
  TPersonProfileResponse,
} from "@common/types";

import { Injectable } from "@nestjs/common";

import { RmqService, kinoDbRpc } from "@common/services";

@Injectable()
export class PersonsClient {
  constructor(private readonly rmq: RmqService) {}

  ping(): Promise<boolean> {
    return this.rmq.sendToFilms(kinoDbRpc.health.ping, {});
  }

  getAllPersons(
    params: TGetPersonsRequest = {}
  ): Promise<TPaginatedPersonsResponse> {
    return this.rmq.sendToFilms(
      kinoDbRpc.persons.getAllPaginated,
      params
    );
  }

  getPersonById(
    request: TGetPersonByIdRequest
  ): Promise<TPersonProfileResponse | null> {
    return this.rmq.sendToFilms(
      kinoDbRpc.persons.getById,
      request
    );
  }

  getFilmography(
    request: TGetPersonFilmsRequest
  ): Promise<TPersonFilmsPaginationResponse | null> {
    return this.rmq.sendToFilms(
      kinoDbRpc.persons.getFilmography,
      request
    );
  }

  findByNameAndProfession(
    request: TFindPersonsByNameAndProfessionRequest
  ): Promise<TPersonListItemResponse[]> {
    return this.rmq.sendToFilms(
      kinoDbRpc.persons.findByNameAndProfession,
      request
    );
  }
}