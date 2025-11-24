import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { ProfessionsService } from './professions.service';
import { JwtAuthGuard } from '../shared/guards';

@Controller('professions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProfessionsController {
  constructor(private readonly professionsService: ProfessionsService) {}

  @ApiOperation({ summary: 'Получить все профессии' })
  @ApiResponse({ status: 200, description: 'Список профессий' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get()
  async getAllProfessions() {
    return await this.professionsService.getAllProfessions();
  }

  @ApiOperation({ summary: 'Получить персон по профессии с пагинацией' })
  @ApiResponse({ status: 200, description: 'Список персон профессии' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiParam({ name: 'profession', description: 'ID профессии', type: Number })
  @ApiQuery({ name: 'page', required: false, description: 'Номер страницы', type: Number })
  @ApiQuery({ name: 'limit', required: false, description: 'Количество элементов на странице', type: Number })
  @Get(':profession/persons')
  async getPersonsByProfession(
    @Param('profession') professionId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    const parsedProfessionId = Number(professionId);
    const parsedPage = page !== undefined && !isNaN(Number(page)) ? Number(page) : undefined;
    const parsedLimit = limit !== undefined && !isNaN(Number(limit)) ? Number(limit) : undefined;

    return await this.professionsService.getPersonsByProfessionId(
      parsedProfessionId,
      parsedPage,
      parsedLimit
    );
  }
}
