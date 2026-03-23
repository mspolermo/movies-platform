import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Genre } from "./genres.model";
import { TGenreListResponse } from "@common/types";

@Injectable()
export class GenresService {
  constructor(@InjectModel(Genre) private genreRepository: typeof Genre) {}

  async getAllGenres(): Promise<TGenreListResponse> {
    const genres = await this.genreRepository.findAll({
      attributes: ["nameRu", "nameEn"],
      order: [["nameRu", "ASC"]],
    });
    return genres;
  }
}
