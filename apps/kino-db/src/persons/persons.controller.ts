import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { PersonsService } from "./persons.service";
import type {
  TFindPersonsByNameAndProfessionRequest,
  TGetPersonByIdRequest,
  TGetPersonsByProfessionRequest,
  TGetPersonsRequest,
} from "@common/types";

@Controller("persons")
export class PersonsController {
  constructor(private readonly personsService: PersonsService) {}

  @MessagePattern("getAllPersonsPaginated")
  async getAllPersonsPaginated(
    @Payload() data: TGetPersonsRequest
  ) {
    const { page = 1, limit = 20 } = data;
    return await this.personsService.getAllPersonsPaginated(page, limit);
  }

  @MessagePattern("getPersonsByProfessionId")
  async getPersonsByProfessionId(
    @Payload() data: TGetPersonsByProfessionRequest
  ) {
    const { professionId, page = 1, limit = 20 } = data;
    return await this.personsService.getPersonsByProfessionId(professionId, page, limit);
  }

  @MessagePattern("getPersonById")
  async getPersonById(@Payload() data: TGetPersonByIdRequest) {
    const { id, filmsLimit, filmsOffset } = data;
    return await this.personsService.getPersonById(id, { filmsLimit, filmsOffset });
  }

  @MessagePattern("findPersonsByNameAndProfession")
  async findPersonsByNameAndProfession(
    @Payload() data: TFindPersonsByNameAndProfessionRequest
  ) {
    const { professionId, name } = data;
    return await this.personsService.findPersonsByNameAndProfession(name, professionId);
  }

  @MessagePattern("searchPersonsByName")
  async searchPersonsByName(@Payload() name: string) {
    return await this.personsService.findPersonsByNameAndProfession(name);
  }
}
