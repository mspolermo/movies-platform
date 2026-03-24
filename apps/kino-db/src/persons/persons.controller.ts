import type {
  TFindPersonsByNameAndProfessionRequest,
  TGetPersonByIdRequest,
  TGetPersonsByProfessionRequest,
  TGetPersonsRequest,
} from "@common/types";

import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

import { kinoDbRpc } from "@common/messaging";

import { PersonsService } from "./persons.service";

@Controller("persons")
export class PersonsController {
  constructor(private readonly personsService: PersonsService) {}

  @MessagePattern(kinoDbRpc.persons.getAllPaginated)
  async getAllPersonsPaginated(
    @Payload() data: TGetPersonsRequest
  ) {
    const { page = 1, limit = 20 } = data;
    return await this.personsService.getAllPersonsPaginated(page, limit);
  }

  @MessagePattern(kinoDbRpc.persons.getByProfessionId)
  async getPersonsByProfessionId(
    @Payload() data: TGetPersonsByProfessionRequest
  ) {
    const { professionId, page = 1, limit = 20 } = data;
    return await this.personsService.getPersonsByProfessionId(professionId, page, limit);
  }

  @MessagePattern(kinoDbRpc.persons.getById)
  async getPersonById(@Payload() data: TGetPersonByIdRequest) {
    const { id, filmsLimit, filmsOffset } = data;
    return await this.personsService.getPersonById(id, { filmsLimit, filmsOffset });
  }

  @MessagePattern(kinoDbRpc.persons.findByNameAndProfession)
  async findPersonsByNameAndProfession(
    @Payload() data: TFindPersonsByNameAndProfessionRequest
  ) {
    const { professionId, name } = data;
    return await this.personsService.findPersonsByNameAndProfession(name, professionId);
  }

  @MessagePattern(kinoDbRpc.persons.searchByName)
  async searchPersonsByName(@Payload() name: string) {
    return await this.personsService.findPersonsByNameAndProfession(name);
  }
}
