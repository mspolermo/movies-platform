import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { PersonsService } from "./persons.service";

@Controller("persons")
export class PersonsController {
  constructor(private readonly personsService: PersonsService) {}

  @MessagePattern("getAllPersons")
  async getAllPersons() {
    return await this.personsService.getAllPersons();
  }

  @MessagePattern("getPersonById")
  async getPersonById(
    @Payload()
    data: number | { id: number; filmsLimit?: number; filmsOffset?: number }
  ) {
    if (typeof data === "number") {
      return await this.personsService.getPersonById(data);
    }

    const { id, filmsLimit, filmsOffset } = data;
    return await this.personsService.getPersonById(id, { filmsLimit, filmsOffset });
  }

  @MessagePattern("findPersonsByNameAndProfession")
  async findPersonsByNameAndProfession(
    @Payload() data: { id: number; name: string }
  ) {
    const { id, name } = data;
    return await this.personsService.findPersonsByNameAndProfession(name, id);
  }

  @MessagePattern("searchPersonsByName")
  async searchPersonsByName(@Payload() name: string) {
    return await this.personsService.findPersonsByNameAndProfession(name);
  }
}
