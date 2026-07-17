import type {
  TFilmDetailsResponse,
  TFilmListItemResponse,
  TFilmsResponse,
  TGetSimilarFilmsRequest,
  TPaginatedPersonsResponse,
  TProfessionItemResponse,
} from "@common/types";
import type { Includeable, WhereOptions } from "sequelize";

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op, Sequelize } from "sequelize";

import { LIST_DEFAULT_LIMIT, LIST_MAX_LIMIT } from "@common/constants";

import { Country } from "../../countries";
import { Genre } from "../../genres/models/genres.model";
import { Person } from "../../persons";
import { mapPersonToListItem } from "../../persons/mappers";
import {
  normalizePersonListPagination,
} from "../../persons/utils/persons-pagination.util";
import { Profession } from "../../professions/models/professions.model";
import {
  FILM_CARD_ATTRIBUTES,
  FILM_GENRE_DB,
  FILM_SORT_ORDER,
} from "../constants";
import { FilmFiltersDto } from "../dto";
import { mapFilmToCardResponse, mapFilmToDetailsResponse } from "../mappers/film.mapping";
import { Fact, Film, FilmGenre } from "../models";

@Injectable()
export class FilmsService {
  constructor(
    @InjectModel(Film)
    private readonly filmRepository: typeof Film,
    @InjectModel(FilmGenre)
    private readonly filmGenreRepository: typeof FilmGenre,
    @InjectModel(Person)
    private readonly personRepository: typeof Person
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

    return mapFilmToDetailsResponse(film);
  }

  /**
   * Похожие фильмы по числу общих жанров (DESC), затем по ratingKp (DESC).
   * Возвращает null, если исходный фильм не найден.
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

    const cappedLimit = Math.min(
      Math.max(limit, 1),
      LIST_MAX_LIMIT
    );

    // ORDER BY sharedCount, ratingKp до LIMIT — иначе tie-break по KP некорректен.
    // GROUP BY / COUNT — физические колонки A/B (attribute-имена ломают Postgres).
    const ranked = (await this.filmGenreRepository.findAll({
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
    })) as unknown as Array<{ filmId: number; sharedCount: string }>;

    if (ranked.length === 0) {
      return [];
    }

    const rankedIds = ranked.map((row) => row.filmId);

    const films = await this.filmRepository.findAll({
      attributes: [...FILM_CARD_ATTRIBUTES],
      where: { id: { [Op.in]: rankedIds } },
    });

    const filmsById = new Map(films.map((film) => [film.id, film]));

    return rankedIds
      .map((id) => filmsById.get(id))
      .filter((film): film is Film => film !== undefined)
      .map(mapFilmToCardResponse);
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

  async filmFilters(dto: FilmFiltersDto): Promise<TFilmsResponse> {

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
  ): Promise<TPaginatedPersonsResponse | null> {
    const film = await this.filmRepository.findByPk(filmId, {
      attributes: ["id"],
    });

    if (!film) {
      return null;
    }

    const { limit: normalizedLimit, offset: normalizedOffset } =
      normalizePersonListPagination(page, limit);

    const { rows, count } =
      await this.personRepository.findAndCountAll({
        attributes: ["id", "photoUrl", "nameRu", "nameEn"],
        include: [
          {
            model: Film,
            as: "films",
            attributes: [],
            through: { attributes: [] },
            where: { id: filmId },
            required: true,
          },
          {
            model: Profession,
            as: "professions",
            attributes: [],
            through: { attributes: [] },
            where: { name: professionName },
            required: true,
          },
        ],
        limit: normalizedLimit,
        offset: normalizedOffset,
        order: [["nameRu", "ASC"]],
        distinct: true,
        col: "id",
      });

    const items = rows.map(mapPersonToListItem);
    const total = Array.isArray(count) ? count.length : count;

    return {
      items,
      total,
      hasMore: normalizedOffset + items.length < total,
    };
  }
}