import type { TFilmListItemResponse, TFilmsResponse } from "@common/types";

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op, Sequelize } from "sequelize";

import { toPaginatedItemsResponse } from "../../common/utils/toPaginatedIemsResponse.util";
import { FILM_CARD_ATTRIBUTES } from "../constants";
import { FilmFiltersDto } from "../dto";
import { mapFilmToCardResponse } from "../mappers/film.mapping";
import { Film } from "../models";
import { buildFilmFiltersQuery } from "../queries";

/** Каталог: поиск по имени, фильтры, список годов. */
@Injectable()
export class FilmCatalogService {
  constructor(
    @InjectModel(Film)
    private readonly filmRepository: typeof Film
  ) {}

  /** Поиск по filmNameRu / filmNameEn (ILIKE), топ-10 по votesKp. */
  async searchFilmsByName(name: string): Promise<TFilmListItemResponse[]> {
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

  /** Пагинированный каталог по жанрам/странам/персонам/годам/рейтингу. */
  async filmFilters(dto: FilmFiltersDto): Promise<TFilmsResponse> {
    const query = buildFilmFiltersQuery(dto);
    const { rows, count } = await this.filmRepository.findAndCountAll(query);

    const total = Array.isArray(count) ? count.length : count;

    return toPaginatedItemsResponse(
      rows.map(mapFilmToCardResponse),
      total,
      dto.page,
      dto.perPage
    );
  }

  /** Уникальные годы фильмов по возрастанию. */
  async getAllFilmYears(): Promise<number[]> {
    const years = await this.filmRepository.findAll({
      attributes: [
        [Sequelize.fn("DISTINCT", Sequelize.col("year")), "year"],
      ],
      order: [[Sequelize.col("year"), "ASC"]],
    });

    return years.map((item) => item.year);
  }
}
