import type {
  TPaginatedPersonsResponse,
  TProfessionItemResponse,
} from "@common/types";

import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";

import { PaginatedPersonsResponseDto } from "../../persons/dto";
import { JwtAuthGuard, Public } from "../../shared";
import {
  ProfessionItemResponseDto,
  ProfessionPersonsParamDto,
  ProfessionPersonsQueryDto,
} from "../dto";
import { ProfessionsService } from "../services";

@ApiTags("Professions")
@Controller("professions")
@UseGuards(JwtAuthGuard)
export class ProfessionsController {
  constructor(private readonly professionsService: ProfessionsService) {}

  @Public()
  @ApiOperation({ summary: "Получить все профессии" })
  @ApiOkResponse({
    description: "Список профессий",
    type: ProfessionItemResponseDto,
    isArray: true,
  })
  @Get()
  getAllProfessions(): Promise<TProfessionItemResponse[]> {
    return this.professionsService.getAllProfessions();
  }

  @Public()
  @ApiOperation({ summary: "Получить персон по профессии с пагинацией" })
  @ApiOkResponse({
    description: "Список персон профессии",
    type: PaginatedPersonsResponseDto,
  })
  @ApiParam({ name: "professionId", description: "ID профессии", type: Number })
  @Get(":professionId/persons")
  getPersonsByProfession(
    @Param() params: ProfessionPersonsParamDto,
    @Query() query: ProfessionPersonsQueryDto
  ): Promise<TPaginatedPersonsResponse> {
    return this.professionsService.getPersonsByProfessionId({
      professionId: params.professionId,
      page: query.page,
      limit: query.limit,
    });
  }
}
