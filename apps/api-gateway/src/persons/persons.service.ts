import type {
  TFindPersonsByNameAndProfessionRequest,
  TGetPersonByIdRequest,
  TGetPersonsRequest,
  TPaginatedPersonsResponse,
  TPersonDetailsResponse,
  TPersonListItemResponse,
} from "@common/types";

import { Injectable } from "@nestjs/common";
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
  ): Promise<TPersonDetailsResponse> {
    return this.sendMessage(kinoDbRpc.persons.getById, request);
  }

  async findPersonsByNameAndProfession(
    request: TFindPersonsByNameAndProfessionRequest
  ): Promise<TPersonListItemResponse[]> {
    return this.sendMessage(kinoDbRpc.persons.findByNameAndProfession, request);
  }
}
