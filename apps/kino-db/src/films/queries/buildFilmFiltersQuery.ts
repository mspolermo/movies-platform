import type { Includeable, OrderItem, WhereOptions } from "sequelize";

import { Op } from "sequelize";

import { Country } from "../../countries";
import { Genre } from "../../genres/models/genres.model";
import { Person } from "../../persons";
import { FILM_CARD_ATTRIBUTES, FILM_SORT_ORDER } from "../constants";
import { FilmFiltersDto } from "../dto";

export type TFilmFiltersFindOptions = {
  attributes: string[];
  include: Includeable[];
  where: WhereOptions;
  limit: number;
  offset: number;
  order: OrderItem[];
  distinct: true;
  col: "id";
};

/**
 * Собирает опции findAndCountAll для фильтров каталога.
 */
export function buildFilmFiltersQuery(
  dto: FilmFiltersDto
): TFilmFiltersFindOptions {
  const {
    page,
    perPage,
    genres,
    countries,
    persons,
    minRatingKp = 0,
    minVotesKp = 0,
    sortBy = "popularity",
    years,
  } = dto;

  const order = FILM_SORT_ORDER[sortBy];

  const attributes = Array.from(
    new Set([...FILM_CARD_ATTRIBUTES, order[0]])
  );

  const include: Includeable[] = [];

  if (genres?.length) {
    include.push({
      model: Genre,
      as: "genres",
      attributes: [],
      through: { attributes: [] },
      required: true,
      where: {
        [Op.or]: [{ nameRu: genres }, { nameEn: genres }],
      },
    });
  }

  if (countries?.length) {
    include.push({
      model: Country,
      as: "countries",
      attributes: [],
      through: { attributes: [] },
      required: true,
      where: {
        [Op.or]: [
          { countryName: countries },
          { countryNameEn: countries },
        ],
      },
    });
  }

  if (persons?.length) {
    include.push({
      model: Person,
      as: "persons",
      attributes: [],
      through: { attributes: [] },
      required: true,
      where: {
        [Op.or]: [{ nameRu: persons }, { nameEn: persons }],
      },
    });
  }

  const where: WhereOptions = {
    ratingKp: {
      [Op.gte]: minRatingKp,
    },
    votesKp: {
      [Op.gte]: minVotesKp,
    },
  };

  if (years?.length) {
    where.year =
      years.length === 1
        ? years[0]
        : {
            [Op.in]: years,
          };
  }

  return {
    attributes,
    include,
    where,
    limit: perPage,
    offset: (page - 1) * perPage,
    order: [order],
    distinct: true,
    col: "id",
  };
}
