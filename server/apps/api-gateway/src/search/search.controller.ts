import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @ApiOperation({ summary: 'Поиск по части имени' })
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
