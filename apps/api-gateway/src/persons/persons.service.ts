import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TPersonBased } from "@common/types";
import { BaseMicroserviceService } from "../shared/services";

@Injectable()
export class PersonsService extends BaseMicroserviceService {
  constructor(configService: ConfigService) {
    super(configService, "Persons Service");
  }

  async getAllPersons(): Promise<TPersonBased[]> {
    return this.sendMessage("getAllPersons", {});
  }

  async getPersonById(id: number): Promise<TPersonBased> {
    return this.sendMessage("getPersonById", id);
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
