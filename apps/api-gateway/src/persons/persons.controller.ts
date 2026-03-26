import type {
  TFindPersonsByNameAndProfessionRequest,
  TGetPersonByIdRequest,
  TGetPersonFilmographyRequest,
  TPaginatedPersonsResponse,
  TPersonFilmographyResponse,
  TPersonListItemResponse,
  TPersonProfileResponse,
} from "@common/types";

import { BadRequestException, Controller, Get, Param, Query } from "@nestjs/common";
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

  @ApiOperation({ summary: "Фильмография персоны (страница)" })
  @ApiResponse({ status: 200, description: "Список фильмов и общее количество" })
  @ApiQuery({ name: "limit", required: false, description: "Размер страницы", type: Number })
  @ApiQuery({ name: "offset", required: false, description: "Смещение", type: Number })
  @Get(":id/filmography")
  async getPersonFilmography(
    @Param("id") id: string,
    @Query("limit") limit?: string,
    @Query("offset") offset?: string
  ): Promise<TPersonFilmographyResponse> {
    const personId = Number(id);
    if (!id || Number.isNaN(personId)) {
      throw new BadRequestException("Invalid person id");
    }
    const parsedLimit =
      limit !== undefined && !isNaN(Number(limit)) ? Number(limit) : undefined;
    const parsedOffset =
      offset !== undefined && !isNaN(Number(offset)) ? Number(offset) : undefined;

    const request: TGetPersonFilmographyRequest = {
      id: personId,
      limit: parsedLimit,
      offset: parsedOffset,
    };

    return await this.personsService.getPersonFilmography(request);
  }

  @ApiOperation({ summary: "Получить человека по ID (профиль)" })
  @ApiResponse({ status: 200, description: "Информация о человеке" })
  @Get(":id")
  async getPersonById(@Param("id") id: string): Promise<TPersonProfileResponse> {
    const personId = Number(id);
    if (!id || Number.isNaN(personId)) {
      throw new BadRequestException("Invalid person id");
    }

    const request: TGetPersonByIdRequest = {
      id: personId,
    };

    return await this.personsService.getPersonById(request);
  }
}
