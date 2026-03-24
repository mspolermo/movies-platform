import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  TFindPersonsByNameAndProfessionRequest,
  TGetPersonByIdRequest,
  TGetPersonsRequest,
  TPaginatedPersonsResponse,
  TPersonDetailsResponse,
  TPersonListItemResponse,
} from "@common/types";
import { BaseMicroserviceService } from "../shared/services";

@Injectable()
export class PersonsService extends BaseMicroserviceService {
  constructor(configService: ConfigService) {
    super(configService, "Persons Service");
  }

  async getAllPersonsPaginated(
    params: TGetPersonsRequest = {}
  ): Promise<TPaginatedPersonsResponse> {
    return this.sendMessage("getAllPersonsPaginated", params);
  }

  async getPersonById(
    request: TGetPersonByIdRequest
  ): Promise<TPersonDetailsResponse> {
    return this.sendMessage("getPersonById", request);
  }

  async findPersonsByNameAndProfession(
    request: TFindPersonsByNameAndProfessionRequest
  ): Promise<TPersonListItemResponse[]> {
    return this.sendMessage("findPersonsByNameAndProfession", request);
  }
}
