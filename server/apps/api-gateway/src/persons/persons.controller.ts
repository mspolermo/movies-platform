import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PersonsService } from './persons.service';

@Controller('persons')
export class PersonsController {
  constructor(private readonly personsService: PersonsService) {}

  @ApiOperation({ summary: 'Получить всех людей' })
  @ApiResponse({ status: 200, description: 'Список людей' })
  @Get()
  async getAllPersons() {
    return await this.personsService.getAllPersons();
  }

  @ApiOperation({ summary: 'Получить человека по ID' })
  @ApiResponse({ status: 200, description: 'Информация о человеке' })
  @Get('/:id')
  async getPersonById(@Param('id') id: number) {
    return await this.personsService.getPersonById(id);
  }
}
