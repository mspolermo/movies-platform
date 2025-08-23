import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FiltersService } from './filters.service';

@Controller('filters')
export class FiltersController {
  constructor(private readonly filtersService: FiltersService) {}

  @ApiOperation({ summary: 'Фильтры для поиска' })
  @ApiResponse({ status: 200 })
  @Get()
  async getFilters() {
    return await this.filtersService.getFilters();
  }
}
