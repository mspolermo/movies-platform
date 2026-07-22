import { Op, Sequelize } from "sequelize";

import { FILM_GENRE_DB } from "../constants";
import { Film, FilmGenre } from "../models";

type TRankedFilmRow = {
  filmId: number;
  sharedCount: string;
};

/**
 * Ранжирует фильмы по числу общих жанров (DESC), затем по ratingKp (DESC).
 * ORDER BY sharedCount, ratingKp до LIMIT — иначе tie-break по KP некорректен.
 * GROUP BY / COUNT — физические колонки A/B (attribute-имена ломают Postgres).
 */
export async function findSimilarFilmIds(
  filmGenreRepository: typeof FilmGenre,
  filmId: number,
  genreIds: number[],
  cappedLimit: number
): Promise<number[]> {
  const ranked = (await filmGenreRepository.findAll({
    attributes: [
      "filmId",
      [
        Sequelize.fn("COUNT", Sequelize.col(FILM_GENRE_DB.genreId)),
        "sharedCount",
      ],
    ],
    include: [
      {
        model: Film,
        as: "Film",
        attributes: [],
        required: true,
      },
    ],
    where: {
      genreId: { [Op.in]: genreIds },
      filmId: { [Op.ne]: filmId },
    },
    group: [FILM_GENRE_DB.filmId],
    order: [
      [Sequelize.fn("COUNT", Sequelize.col(FILM_GENRE_DB.genreId)), "DESC"],
      [Sequelize.fn("MAX", Sequelize.col("Film.ratingKp")), "DESC"],
    ],
    limit: cappedLimit,
    subQuery: false,
    raw: true,
  })) as unknown as TRankedFilmRow[];

  return ranked.map((row) => row.filmId);
}
