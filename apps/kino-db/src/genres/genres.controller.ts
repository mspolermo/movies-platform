import { Controller } from "@nestjs/common";
import { GenresService } from "./genres.service";
import { MessagePattern } from "@nestjs/microservices";
import { TGenreItemResponse } from "@common/types";

@Controller("genres")
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @MessagePattern("getAll.genres")
  async getAllGenres(): Promise<TGenreItemResponse[]> {
    return await this.genresService.getAllGenres();
  }
}
