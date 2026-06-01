import type { TGenreItemResponse } from "@common/types";

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";

import { Genre } from "../models/genres.model"

@Injectable()
export class GenresService {
  constructor(@InjectModel(Genre) private genreRepository: typeof Genre) {}

  getAllGenres(): Promise<TGenreItemResponse[]> {
    return this.genreRepository.findAll({
      attributes: ["nameRu", "nameEn"],
      order: [["nameRu", "ASC"]],
    });
  }
}
