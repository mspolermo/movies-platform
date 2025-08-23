import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PersonsService } from './persons.service';

@Controller('persons')
export class PersonsController {
  constructor(private readonly personsService: PersonsService) {}

  @ApiOperation({ summary: 'Получение персона по id' })
  @ApiResponse({ status: 200, description: 'Информация о персоне' })
  @Get('/:id')
  async getPersonById(@Param('id') id: number) {
    return await this.personsService.getPersonById(id);
  }

  @ApiOperation({ summary: 'Получение персона по имени и id профессии' })
  @ApiResponse({ status: 200, description: 'Список персон' })
  @Get('/search/by-profession')
  async findPersonsByNameAndProfession(
    @Query('name') name?: string,
    @Query('professionId') professionId?: number,
  ) {
    return await this.personsService.findPersonsByNameAndProfession(
      name,
      professionId,
    );
  }
}
