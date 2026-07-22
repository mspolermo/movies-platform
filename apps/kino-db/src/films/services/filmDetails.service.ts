import type { TFilmDetailsResponse } from "@common/types";

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";

import { Country } from "../../countries";
import { Genre } from "../../genres/models/genres.model";
import { mapFilmToDetailsResponse } from "../mappers/film.mapping";
import { Fact, Film } from "../models";

/** Карточка фильма: детали, страны, жанры, факты. */
@Injectable()
export class FilmDetailsService {
  constructor(
    @InjectModel(Film)
    private readonly filmRepository: typeof Film
  ) {}

  /** Фильм по id или null, если не найден. */
  async getFilmById(id: number): Promise<TFilmDetailsResponse | null> {
    const film = await this.filmRepository.findByPk(id, {
      attributes: [
        "id",
        "trailerUrl",
        "ratingKp",
        "votesKp",
        "movieLength",
        "filmNameRu",
        "filmNameEn",
        "description",
        "slogan",
        "bigPictureUrl",
        "smallPictureUrl",
        "year",
      ],
      include: [
        {
          model: Country,
          as: "countries",
          attributes: ["countryName", "countryNameEn"],
          through: { attributes: [] },
        },
        {
          model: Genre,
          as: "genres",
          attributes: ["nameRu", "nameEn"],
          through: { attributes: [] },
        },
        {
          model: Fact,
          as: "facts",
          attributes: ["type", "value", "spoiler"],
          separate: true,
          order: [["id", "ASC"]],
        },
      ],
    });

    if (!film) {
      return null;
    }

    return mapFilmToDetailsResponse(film);
  }
}
