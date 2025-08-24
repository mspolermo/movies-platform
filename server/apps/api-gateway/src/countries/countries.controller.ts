import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CountriesService } from './countries.service';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @ApiOperation({ summary: 'Получить все страны' })
  @ApiResponse({ status: 200, description: 'Список стран' })
  @Get()
  async getAllCountries() {
    return await this.countriesService.getAllCountries();
  }
}
