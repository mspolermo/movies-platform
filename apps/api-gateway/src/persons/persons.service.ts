import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TPersonBased, TPersonModel, PaginatedPersonsResponse } from "@common/types";
import { BaseMicroserviceService } from "../shared/services";

@Injectable()
export class PersonsService extends BaseMicroserviceService {
  constructor(configService: ConfigService) {
    super(configService, "Persons Service");
  }

  async getAllPersons(): Promise<TPersonBased[]> {
    return this.sendMessage("getAllPersons", {});
  }

  async getAllPersonsPaginated(page?: number, limit?: number): Promise<PaginatedPersonsResponse> {
    return this.sendMessage("getAllPersonsPaginated", { page, limit });
  }

  async getPersonById(
    id: number,
    options: { filmsLimit?: number; filmsOffset?: number } = {}
  ): Promise<TPersonModel> {
    return this.sendMessage("getPersonById", { id, ...options });
  }

  async findPersonsByNameAndProfession(
    name?: string,
    professionId?: number
  ): Promise<TPersonBased[]> {
    return this.sendMessage("findPersonsByNameAndProfession", {
      name,
      id: professionId,
    });
  }
}
