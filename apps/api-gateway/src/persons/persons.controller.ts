import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { PersonsService } from "./persons.service";
import { JwtAuthGuard } from "../shared/guards";

@Controller("persons")
@UseGuards(JwtAuthGuard) // Защищаем весь контроллер
@ApiBearerAuth()
export class PersonsController {
  constructor(private readonly personsService: PersonsService) {}

  @ApiOperation({ summary: "Получить всех людей" })
  @ApiResponse({ status: 200, description: "Список людей" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @Get()
  async getAllPersons() {
    return await this.personsService.getAllPersons();
  }

  @ApiOperation({ summary: "Получить человека по ID" })
  @ApiResponse({ status: 200, description: "Информация о человеке" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiQuery({ name: "filmsLimit", required: false, description: "Количество фильмов в ответе", type: Number })
  @ApiQuery({ name: "filmsOffset", required: false, description: "Смещение по фильмам", type: Number })
  @Get("/:id")
  async getPersonById(
    @Param("id") id: number,
    @Query("filmsLimit") filmsLimit?: string,
    @Query("filmsOffset") filmsOffset?: string
  ) {
    const parsedLimit =
      filmsLimit !== undefined && !isNaN(Number(filmsLimit)) ? Number(filmsLimit) : undefined;
    const parsedOffset =
      filmsOffset !== undefined && !isNaN(Number(filmsOffset)) ? Number(filmsOffset) : undefined;

    return await this.personsService.getPersonById(id, {
      filmsLimit: parsedLimit,
      filmsOffset: parsedOffset,
    });
  }

  @ApiOperation({ summary: "Поиск людей по имени и профессии" })
  @ApiResponse({ status: 200, description: "Список найденных людей" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiQuery({ name: "name", required: false, description: "Имя человека" })
  @ApiQuery({ name: "professionId", required: false, description: "ID профессии" })
  @Get("search/find")
  async findPersonsByNameAndProfession(
    @Query("name") name?: string,
    @Query("professionId") professionId?: number
  ) {
    return await this.personsService.findPersonsByNameAndProfession(name, professionId);
  }
}
