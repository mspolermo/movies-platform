import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PersonsService } from './persons.service';
import { JwtAuthGuard } from '../shared/guards';

@Controller('persons')
@UseGuards(JwtAuthGuard) // Защищаем весь контроллер
@ApiBearerAuth()
export class PersonsController {
  constructor(private readonly personsService: PersonsService) {}

  @ApiOperation({ summary: 'Получить всех людей' })
  @ApiResponse({ status: 200, description: 'Список людей' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get()
  async getAllPersons() {
    return await this.personsService.getAllPersons();
  }

  @ApiOperation({ summary: 'Получить человека по ID' })
  @ApiResponse({ status: 200, description: 'Информация о человеке' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('/:id')
  async getPersonById(@Param('id') id: number) {
    return await this.personsService.getPersonById(id);
  }
}
