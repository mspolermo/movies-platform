import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { GenresService } from './genres.service';
import { GenreDTO } from './dto';
import { ValidationPipe } from '../shared/pipes';
import { Roles, RolesGuard, JwtAuthGuard } from '../shared/guards';

@Controller('genres')
@UseGuards(JwtAuthGuard) // Защищаем весь контроллер
@ApiBearerAuth()
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @ApiOperation({ summary: 'Получение всех жанров' })
  @ApiResponse({ status: 200, description: 'Список жанров' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get()
  async getAllGenres() {
    return await this.genresService.getAllGenres();
  }

  @ApiOperation({ summary: 'Изменение жанра' })
  @ApiResponse({ status: 200 })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @UsePipes(ValidationPipe)
  @Patch('/:id')
  async updateGenre(@Param('id') id: number, @Body() dto: GenreDTO) {
    return await this.genresService.updateGenre(id, dto);
  }
}
