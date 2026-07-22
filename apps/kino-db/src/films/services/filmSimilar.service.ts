import type {
  TFilmListItemResponse,
  TGetSimilarFilmsRequest,
} from "@common/types";

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";

import { LIST_DEFAULT_LIMIT, LIST_MAX_LIMIT } from "@common/constants";

import { FILM_CARD_ATTRIBUTES } from "../constants";
import { mapFilmToCardResponse } from "../mappers/film.mapping";
import { Film, FilmGenre } from "../models";
import { findSimilarFilmIds } from "../queries";

/** Рекомендации: похожие фильмы по пересечению жанров. */
@Injectable()
export class FilmSimilarService {
  constructor(
    @InjectModel(Film)
    private readonly filmRepository: typeof Film,
    @InjectModel(FilmGenre)
    private readonly filmGenreRepository: typeof FilmGenre
  ) {}

  /**
   * Похожие фильмы по числу общих жанров (DESC), затем по ratingKp (DESC).
   * `null`, если исходный фильм не найден; `[]`, если жанров нет.
   */
  async getSimilarFilms({
    filmId,
    limit = LIST_DEFAULT_LIMIT,
  }: TGetSimilarFilmsRequest): Promise<TFilmListItemResponse[] | null> {
    const film = await this.filmRepository.findByPk(filmId, {
      attributes: ["id"],
    });

    if (!film) {
      return null;
    }

    const sourceGenres = await this.filmGenreRepository.findAll({
      attributes: ["genreId"],
      where: { filmId },
      raw: true,
    });

    const genreIds = sourceGenres.map((row) => row.genreId);

    if (genreIds.length === 0) {
      return [];
    }

    const cappedLimit = Math.min(Math.max(limit, 1), LIST_MAX_LIMIT);

    const rankedIds = await findSimilarFilmIds(
      this.filmGenreRepository,
      filmId,
      genreIds,
      cappedLimit
    );

    if (rankedIds.length === 0) {
      return [];
    }

    const films = await this.filmRepository.findAll({
      attributes: [...FILM_CARD_ATTRIBUTES],
      where: { id: { [Op.in]: rankedIds } },
    });

    const filmsById = new Map(films.map((item) => [item.id, item]));

    return rankedIds
      .map((id) => filmsById.get(id))
      .filter((item): item is Film => item !== undefined)
      .map(mapFilmToCardResponse);
  }
}
