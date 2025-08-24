import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { FiltersService } from './filters.service';
import { JwtAuthGuard } from '../shared/guards';

@Controller('filters')
@UseGuards(JwtAuthGuard) // Защищаем весь контроллер
@ApiBearerAuth()
export class FiltersController {
  constructor(private readonly filtersService: FiltersService) {}

  @ApiOperation({ summary: 'Фильтры для поиска' })
  @ApiResponse({ status: 200, description: 'Доступные фильтры' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get()
  async getFilters() {
    return await this.filtersService.getFilters();
  }
}
