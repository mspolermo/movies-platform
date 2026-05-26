import type {
  TFilmDetailsResponse,
  TFilmListItemResponse,
  TFilmsResponse,
  TFilmSortBy,
  TPaginatedPersonsResponse,
  TProfessionItemResponse,
} from "@common/types";
import type { Includeable, WhereOptions } from "sequelize";

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op, Sequelize } from "sequelize";

import { LIST_DEFAULT_LIMIT, LIST_MAX_LIMIT } from "@common/constants";

import { Country } from "../../countries";
import { Genre } from "../../genres/genres.model";
import { Person } from "../../persons";
import { Profession } from "../../professions/professions.model";
import {
  FILM_CARD_ATTRIBUTES,
  FILM_SORT_ORDER,
} from "../constants";
import { mapFilmToCardResponse } from "../mappers/film.mapper";
import { Fact, Film } from "../models";

@Injectable()
export class FilmsService {
  constructor(
    @InjectModel(Film)
    private readonly filmRepository: typeof Film
  ) {}

  async getFilmById(
    id: number
  ): Promise<TFilmDetailsResponse | null> {
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

    return film.toJSON() as TFilmDetailsResponse;
  }

  async searchFilmsByName(
    name: string
  ): Promise<TFilmListItemResponse[]> {
    const films = await this.filmRepository.findAll({
      attributes: [...FILM_CARD_ATTRIBUTES],
      where: {
        [Op.or]: [
          {
            filmNameRu: {
              [Op.iLike]: `%${name}%`,
            },
          },
          {
            filmNameEn: {
              [Op.iLike]: `%${name}%`,
            },
          },
        ],
      },
      limit: 10,
      order: [["votesKp", "DESC"]],
    });

    return films.map(mapFilmToCardResponse);
  }

  async filmFilters(
    page: number,
    perPage: number,
    genres?: string[],
    countries?: string[],
    persons?: string[],
    minRatingKp = 0,
    minVotesKp = 0,
    sortBy: TFilmSortBy = "popularity",
    years?: number[]
  ): Promise<TFilmsResponse> {
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
          [Op.or]: [
            { nameRu: genres },
            { nameEn: genres },
          ],
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
          [Op.or]: [
            { nameRu: persons },
            { nameEn: persons },
          ],
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

    const { rows, count } =
      await this.filmRepository.findAndCountAll({
        attributes,
        include,
        where,
        limit: perPage,
        offset: (page - 1) * perPage,
        order: [order],
        distinct: true,
        col: "id",
      });

    const total = Array.isArray(count)
      ? count.length
      : count;

    return {
      films: rows.map(mapFilmToCardResponse),
      total,
      page,
      perPage,
      hasMore: page * perPage < total,
    };
  }

  async getAllFilmYears(): Promise<number[]> {
    const years = await this.filmRepository.findAll({
      attributes: [
        [
          Sequelize.fn(
            "DISTINCT",
            Sequelize.col("year")
          ),
          "year",
        ],
      ],
      order: [[Sequelize.col("year"), "ASC"]],
    });

    return years.map((item) => item.year);
  }

  async getFilmProfessions(
    filmId: number
  ): Promise<TProfessionItemResponse[]> {
    const film = await this.filmRepository.findByPk(filmId, {
      include: [
        {
          model: Person,
          as: "persons",
          attributes: ["id"],
          through: { attributes: [] },
          include: [
            {
              model: Profession,
              as: "professions",
              attributes: ["id", "name"],
              through: { attributes: [] },
            },
          ],
        },
      ],
    });

    if (!film) {
      return [];
    }

    const professionsMap = new Map<
      number,
      TProfessionItemResponse
    >();

    for (const person of film.persons ?? []) {
      for (const profession of person.professions ?? []) {
        if (!professionsMap.has(profession.id)) {
          professionsMap.set(profession.id, {
            id: profession.id,
            name: profession.name,
          });
        }
      }
    }

    return [...professionsMap.values()];
  }

  async getFilmPersonsByProfession(
    filmId: number,
    professionName: string,
    page = 1,
    limit = LIST_DEFAULT_LIMIT
  ): Promise<TPaginatedPersonsResponse> {
    const normalizedLimit =
      limit > 0 && limit <= LIST_MAX_LIMIT
        ? limit
        : LIST_DEFAULT_LIMIT;

    const normalizedPage =
      page > 0 ? page : 1;

    const offset =
      (normalizedPage - 1) * normalizedLimit;

    const film = await this.filmRepository.findByPk(filmId, {
      include: [
        {
          model: Person,
          as: "persons",
          attributes: [
            "id",
            "photoUrl",
            "nameRu",
            "nameEn",
          ],
          through: { attributes: [] },
          include: [
            {
              model: Profession,
              as: "professions",
              attributes: ["id", "name"],
              through: { attributes: [] },
              where: {
                name: professionName,
              },
            },
          ],
        },
      ],
    });

    if (!film) {
      return {
        items: [],
        total: 0,
        hasMore: false,
      };
    }

    const persons =
      (film.persons ?? []).filter(
        (person) =>
          (person.professions?.length ?? 0) > 0
      );

    const total = persons.length;

    const items = persons.slice(
      offset,
      offset + normalizedLimit
    );

    return {
      items,
      total,
      hasMore:
        offset + items.length < total,
    };
  }
}