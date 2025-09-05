import { Controller, HttpStatus } from "@nestjs/common";
import { GenresService } from "./genres.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { GenreDto } from "@common/dto";

@Controller("genres")
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @MessagePattern("getAll.genres")
  async getAllGenres() {
    return await this.genresService.getAllGenres();
  }

  @MessagePattern("searchGenresByName")
  async searchGenresByName(@Payload() name: string) {
    return await this.genresService.searchGenresByName(name);
  }

  @MessagePattern("updateGenre")
  async updateGenre(@Payload() data: { id: number; dto: GenreDto }) {
    const { id, dto } = data;
    await this.genresService.updateGenre(id, dto);
    return HttpStatus.OK;
  }
}
