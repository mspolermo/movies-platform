import type {
  TPaginatedPersonsResponse,
  TProfessionItemResponse,
} from '@common/types';

import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

import { JwtAuthGuard, Public } from '../../shared/guards';
import { ProfessionPersonsParamDto, ProfessionPersonsQueryDto } from '../dto';
import { ProfessionsService } from '../services';

@Controller('professions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProfessionsController {
  constructor(private readonly professionsService: ProfessionsService) {}

  @Public()
  @ApiOperation({ summary: 'Получить все профессии' })
  @ApiResponse({ status: 200, description: 'Список профессий' })
  @Get()
  getAllProfessions(): Promise<TProfessionItemResponse[]> {
    return this.professionsService.getAllProfessions();
  }

  @Public()
  @ApiOperation({ summary: 'Получить персон по профессии с пагинацией' })
  @ApiResponse({ status: 200, description: 'Список персон профессии' })
  @ApiParam({ name: 'professionId', description: 'ID профессии', type: Number })
  @Get(":professionId/persons")
  getPersonsByProfession(
    @Param() params: ProfessionPersonsParamDto,
    @Query() query: ProfessionPersonsQueryDto,
  ): Promise<TPaginatedPersonsResponse> {
    return this.professionsService.getPersonsByProfessionId({
      professionId: params.professionId,
      page: query.page,
      limit: query.limit,
    });
  }
}
