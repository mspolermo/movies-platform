import type {
  TPaginatedPersonsResponse,
  TPersonFilmsPaginationResponse,
  TPersonListItemResponse,
  TPersonProfileResponse,
} from "@common/types";

import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { JwtAuthGuard, Public } from "../../shared";
import {
  FilmographyQueryDto,
  FindPersonsQueryDto,
  GetPersonsQueryDto,
  PaginatedPersonsResponseDto,
  PersonFilmsPaginationResponseDto,
  PersonIdParamDto,
  PersonListItemResponseDto,
  PersonProfileResponseDto,
} from "../dto";
import { PersonsService } from "../services";

@ApiTags("Persons")
@Controller("persons")
@UseGuards(JwtAuthGuard)
export class PersonsController {
  constructor(private readonly personsService: PersonsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: "Пагинированный список персон" })
  @ApiOkResponse({
    description: "Список персон с пагинацией",
    type: PaginatedPersonsResponseDto,
  })
  getAll(
    @Query() query: GetPersonsQueryDto
  ): Promise<TPaginatedPersonsResponse> {
    return this.personsService.getAllPersonsPaginated(query);
  }

  @Public()
  @Get("search")
  @ApiOperation({ summary: "Поиск персон по имени и профессии" })
  @ApiOkResponse({
    description: "Найденные персоны",
    type: PersonListItemResponseDto,
    isArray: true,
  })
  search(
    @Query() query: FindPersonsQueryDto
  ): Promise<TPersonListItemResponse[]> {
    return this.personsService.findPersonsByNameAndProfession(query);
  }

  @Public()
  @Get(":id/filmography")
  @ApiOperation({ summary: "Фильмография персоны" })
  @ApiOkResponse({
    description: "Пагинированная фильмография",
    type: PersonFilmsPaginationResponseDto,
  })
  getFilmography(
    @Param() params: PersonIdParamDto,
    @Query() query: FilmographyQueryDto
  ): Promise<TPersonFilmsPaginationResponse> {
    return this.personsService.getPersonFilmography({
      id: params.id,
      ...query,
    });
  }

  @Public()
  @Get(":id")
  @ApiOperation({ summary: "Профиль персоны" })
  @ApiOkResponse({
    description: "Профиль персоны с профессиями",
    type: PersonProfileResponseDto,
  })
  getById(
    @Param() params: PersonIdParamDto
  ): Promise<TPersonProfileResponse> {
    return this.personsService.getPersonById({ id: params.id });
  }
}
