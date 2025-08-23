import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GenresService } from './genres.service';
import { GenreDTO } from './dto';
import { ValidationPipe } from '../shared/pipes';
import { Roles, RolesGuard } from '../shared/guards';

@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @ApiOperation({ summary: 'Получение всех жанров' })
  @ApiResponse({ status: 200, description: 'Список жанров' })
  @Get()
  async getAllGenres() {
    return await this.genresService.getAllGenres();
  }

  @ApiOperation({ summary: 'Изменение жанра' })
  @ApiResponse({ status: 200 })
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @UsePipes(ValidationPipe)
  @Patch('/:id')
  async updateGenre(@Param('id') id: number, @Body() dto: GenreDTO) {
    return await this.genresService.updateGenre(id, dto);
  }
}
