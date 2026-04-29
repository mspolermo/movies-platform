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

import { Injectable, NotFoundException } from "@nestjs/common";

import { RmqService, kinoDbRpc } from "@common/services";

@Injectable()
export class PersonsService {
  constructor(private readonly rmq: RmqService) {}

  async ping(): Promise<boolean> {
    await this.rmq.sendToFilms("health.ping", {});
    return true;
  }

  async getAllPersonsPaginated(
    params: TGetPersonsRequest = {}
  ): Promise<TPaginatedPersonsResponse> {
    return this.rmq.sendToFilms(kinoDbRpc.persons.getAllPaginated, params);
  }

  async getPersonById(
    request: TGetPersonByIdRequest
  ): Promise<TPersonProfileResponse> {
    const person = await this.rmq.sendToFilms<TPersonProfileResponse | null>(
      kinoDbRpc.persons.getById,
      request
    );

    if (!person) {
      throw new NotFoundException(`Person with id ${request.id} not found`);
    }

    return person;
  }

  async getPersonFilmography(
    request: TGetPersonFilmsRequest
  ): Promise<TPersonFilmsPaginationResponse> {
    const data = await this.rmq.sendToFilms<TPersonFilmsPaginationResponse | null>(
      kinoDbRpc.persons.getFilmography,
      request
    );

    if (!data) {
      throw new NotFoundException(`Person with id ${request.id} not found`);
    }

    return data;
  }

  async findPersonsByNameAndProfession(
    request: TFindPersonsByNameAndProfessionRequest
  ): Promise<TPersonListItemResponse[]> {
    return this.rmq.sendToFilms(kinoDbRpc.persons.findByNameAndProfession, request);
  }
}
