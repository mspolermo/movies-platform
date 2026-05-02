import type {
  TPaginatedPersonsResponse,
  TProfessionItemResponse,
} from '@common/types';

import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';

import { JwtAuthGuard, Public } from '../shared/guards';

import { ProfessionPersonsParamDto, ProfessionPersonsQueryDto } from './dto';
import { ProfessionsService } from './professions.service';

@Controller('professions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProfessionsController {
  constructor(private readonly professionsService: ProfessionsService) {}

  @Public()
  @ApiOperation({ summary: 'Получить все профессии' })
  @ApiResponse({ status: 200, description: 'Список профессий' })
  @Get()
  async getAllProfessions(): Promise<TProfessionItemResponse[]> {
    return await this.professionsService.getAllProfessions();
  }

  @Public()
  @ApiOperation({ summary: 'Получить персон по профессии с пагинацией' })
  @ApiResponse({ status: 200, description: 'Список персон профессии' })
  @ApiParam({ name: 'profession', description: 'ID профессии', type: Number })
  @Get(':profession/persons')
  async getPersonsByProfession(
    @Param() params: ProfessionPersonsParamDto,
    @Query() query: ProfessionPersonsQueryDto
  ): Promise<TPaginatedPersonsResponse> {
    return await this.professionsService.getPersonsByProfessionId({
      professionId: params.profession,
      page: query.page,
      limit: query.limit,
    });
  }
}
