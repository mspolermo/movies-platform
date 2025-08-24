import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { JwtAuthGuard } from '../shared/guards';

@Controller('search')
@UseGuards(JwtAuthGuard) // Защищаем весь контроллер
@ApiBearerAuth()
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @ApiOperation({ summary: 'Поиск по части имени' })
  @ApiResponse({ status: 200, description: 'Результаты поиска' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get()
  async search(@Query('name') name?: string) {
    console.log('🔍 Поисковый запрос:', {
      name,
      timestamp: new Date().toISOString(),
    });

    try {
      const result = await this.searchService.searchByName(name);
      console.log('✅ Поиск завершен успешно');
      return result;
    } catch (error) {
      console.error('❌ Ошибка в контроллере поиска:', error);
      throw error;
    }
  }
}
