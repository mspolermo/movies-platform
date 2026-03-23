import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
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

  async getAllPersons(): Promise<TPersonListItemResponse[]> {
    return this.sendMessage("getAllPersons", {});
  }

  async getAllPersonsPaginated(
    page?: number,
    limit?: number
  ): Promise<TPaginatedPersonsResponse> {
    return this.sendMessage("getAllPersonsPaginated", { page, limit });
  }

  async getPersonById(
    id: number,
    options: { filmsLimit?: number; filmsOffset?: number } = {}
  ): Promise<TPersonDetailsResponse> {
    return this.sendMessage("getPersonById", { id, ...options });
  }

  async findPersonsByNameAndProfession(
    name?: string,
    professionId?: number
  ): Promise<TPersonListItemResponse[]> {
    return this.sendMessage("findPersonsByNameAndProfession", {
      name,
      id: professionId,
    });
  }
}
