import type {
  TPaginatedPersonsResponse,
  TProfessionItemResponse,
} from "@common/types";

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";

import { LIST_DEFAULT_LIMIT } from "@common/constants";

import { toPaginatedItemsResponse } from "../../common/utils/toPaginatedIemsResponse.util";
import { Person } from "../../persons";
import { mapPersonToListItem } from "../../persons/mappers";
import { normalizePersonListPagination } from "../../persons/utils/personsPagination.util";
import { Profession } from "../../professions/models/professions.model";
import { Film } from "../models";
import { collectUniqueProfessions } from "../queries";

/** Состав фильма: профессии и персоны по профессии. */
@Injectable()
export class FilmCastService {
  constructor(
    @InjectModel(Film)
    private readonly filmRepository: typeof Film,
    @InjectModel(Person)
    private readonly personRepository: typeof Person
  ) {}

  /** Уникальные профессии участников фильма; `[]`, если фильм не найден. */
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

    return collectUniqueProfessions(film.persons ?? []);
  }

  /**
   * Персоны фильма с заданной профессией (пагинация).
   * `null`, если фильм не найден.
   */
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

    const {
      page: normalizedPage,
      limit: normalizedLimit,
      offset: normalizedOffset,
    } = normalizePersonListPagination(page, limit);

    const { rows, count } = await this.personRepository.findAndCountAll({
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

    return toPaginatedItemsResponse(
      items,
      total,
      normalizedPage,
      normalizedLimit
    );
  }
}
