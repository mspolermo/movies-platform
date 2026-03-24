import type {
  TFindPersonsByNameAndProfessionRequest,
  TGetPersonByIdRequest,
  TPaginatedPersonsResponse,
  TPersonDetailsResponse,
  TPersonListItemResponse,
} from "@common/types";

import { Controller, Get, Param, Query } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiQuery } from "@nestjs/swagger";

import { PersonsService } from "./persons.service";

@Controller("persons")
export class PersonsController {
  constructor(private readonly personsService: PersonsService) {}

  @ApiOperation({ summary: "Получить всех людей" })
  @ApiResponse({ status: 200, description: "Список людей" })
  @ApiQuery({ name: "page", required: false, description: "Номер страницы", type: Number })
  @ApiQuery({ name: "limit", required: false, description: "Количество элементов на странице", type: Number })
  @Get()
  async getAllPersonsPaginated(
    @Query("page") page?: string,
    @Query("limit") limit?: string
  ): Promise<TPaginatedPersonsResponse> {
    const parsedPage = page !== undefined && !isNaN(Number(page)) ? Number(page) : undefined;
    const parsedLimit = limit !== undefined && !isNaN(Number(limit)) ? Number(limit) : undefined;
    return await this.personsService.getAllPersonsPaginated({
      page: parsedPage,
      limit: parsedLimit,
    });
  }

  @ApiOperation({ summary: "Получить человека по ID" })
  @ApiResponse({ status: 200, description: "Информация о человеке" })
  @ApiQuery({ name: "filmsLimit", required: false, description: "Количество фильмов в ответе", type: Number })
  @ApiQuery({ name: "filmsOffset", required: false, description: "Смещение по фильмам", type: Number })
  @Get("/:id")
  async getPersonById(
    @Param("id") id: number,
    @Query("filmsLimit") filmsLimit?: string,
    @Query("filmsOffset") filmsOffset?: string
  ): Promise<TPersonDetailsResponse> {
    const parsedLimit =
      filmsLimit !== undefined && !isNaN(Number(filmsLimit)) ? Number(filmsLimit) : undefined;
    const parsedOffset =
      filmsOffset !== undefined && !isNaN(Number(filmsOffset)) ? Number(filmsOffset) : undefined;

    const request: TGetPersonByIdRequest = {
      id,
      filmsLimit: parsedLimit,
      filmsOffset: parsedOffset,
    };

    return await this.personsService.getPersonById(request);
  }

  @ApiOperation({ summary: "Поиск людей по имени и профессии" })
  @ApiResponse({ status: 200, description: "Список найденных людей" })
  @ApiQuery({ name: "name", required: false, description: "Имя человека" })
  @ApiQuery({ name: "professionId", required: false, description: "ID профессии" })
  @Get("search/find")
  async findPersonsByNameAndProfession(
    @Query("name") name?: string,
    @Query("professionId") professionId?: number
  ): Promise<TPersonListItemResponse[]> {
    const request: TFindPersonsByNameAndProfessionRequest = {
      name,
      professionId,
    };

    return await this.personsService.findPersonsByNameAndProfession(request);
  }
}
