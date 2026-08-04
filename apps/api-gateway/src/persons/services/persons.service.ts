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

import { PersonsClient } from "../clients";

@Injectable()
export class PersonsService {
  constructor(private readonly personsClient: PersonsClient) {}

  async getAllPersonsPaginated(
    params: TGetPersonsRequest = {}
  ): Promise<TPaginatedPersonsResponse> {
    return this.personsClient.getAllPersons(params);
  }

  async getPersonById(
    request: TGetPersonByIdRequest
  ): Promise<TPersonProfileResponse> {
    const person = await this.personsClient.getPersonById(request);

    if (!person) {
      throw new NotFoundException(
        `Person with id ${request.id} not found`
      );
    }

    return person;
  }

  async getPersonFilmography(
    request: TGetPersonFilmsRequest
  ): Promise<TPersonFilmsPaginationResponse> {
    const data = await this.personsClient.getFilmography(request);

    if (!data) {
      throw new NotFoundException(
        `Person with id ${request.id} not found`
      );
    }

    return data;
  }

  async findPersonsByNameAndProfession(
    request: TFindPersonsByNameAndProfessionRequest
  ): Promise<TPersonListItemResponse[]> {
    return this.personsClient.findByNameAndProfession(request);
  }
}