
import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

import { kinoDbRpc } from "@common/services";

import { GetPersonByIdDto, GetPersonsByProfessionDto, GetPersonsDto, SearchPersonDto } from "../dto";
import { PersonsService } from "../services/persons.service";

@Controller("persons")
export class PersonsController {
  constructor(private readonly personsService: PersonsService) {}

  @MessagePattern(kinoDbRpc.persons.getAllPaginated)
  getAllPersonsPaginated(@Payload() dto: GetPersonsDto) {
    return this.personsService.getAllPersonsPaginated(dto.page, dto.limit);
  }

  @MessagePattern(kinoDbRpc.persons.getByProfessionId)
  getPersonsByProfessionId(@Payload() dto: GetPersonsByProfessionDto) {
    return this.personsService.getPersonsByProfessionId(
      dto.professionId,
      dto.page,
      dto.limit
    );
  }

  @MessagePattern(kinoDbRpc.persons.getById)
  getPersonById(@Payload() dto: GetPersonByIdDto) {
    return this.personsService.getPersonProfile(dto.id);
  }

  @MessagePattern(kinoDbRpc.persons.findByNameAndProfession)
  findPersons(@Payload() dto: SearchPersonDto) {
    return this.personsService.findPersonsByNameAndProfession(
      dto.name,
      dto.professionId
    );
  }
}
