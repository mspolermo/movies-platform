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
import { ConfigService } from "@nestjs/config";

import { kinoDbRpc } from "@common/messaging";

import { BaseMicroserviceService } from "../shared/services";

@Injectable()
export class PersonsService extends BaseMicroserviceService {
  constructor(configService: ConfigService) {
    super(configService, "Persons Service");
  }

  async getAllPersonsPaginated(
    params: TGetPersonsRequest = {}
  ): Promise<TPaginatedPersonsResponse> {
    return this.sendMessage(kinoDbRpc.persons.getAllPaginated, params);
  }

  async getPersonById(
    request: TGetPersonByIdRequest
  ): Promise<TPersonProfileResponse> {
    const person = await this.sendMessage<TPersonProfileResponse | null>(
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
    const data = await this.sendMessage<TPersonFilmsPaginationResponse | null>(
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
    return this.sendMessage(kinoDbRpc.persons.findByNameAndProfession, request);
  }
}
