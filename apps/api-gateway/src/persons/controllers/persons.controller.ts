import { Controller, Get, Param, Query } from "@nestjs/common";

import { PersonsService } from "../services";
import { 
  FilmographyQueryDto, 
  FindPersonsQueryDto, 
  GetPersonsQueryDto, 
  PersonIdParamDto 
} from "../dto";

@Controller("persons")
export class PersonsController {
  constructor(private readonly personsService: PersonsService) {}

  @Get()
  getAll(@Query() query: GetPersonsQueryDto) {
    return this.personsService.getAllPersonsPaginated(query);
  }

  @Get("search")
  search(@Query() query: FindPersonsQueryDto) {
    return this.personsService.findPersonsByNameAndProfession(query);
  }

  @Get(":id/filmography")
  getFilmography(
    @Param() params: PersonIdParamDto,
    @Query() query: FilmographyQueryDto
  ) {
    return this.personsService.getPersonFilmography({
      id: params.id,
      ...query,
    });
  }

  @Get(":id")
  getById(@Param() params: PersonIdParamDto) {
    return this.personsService.getPersonById({ id: params.id });
  }
}
