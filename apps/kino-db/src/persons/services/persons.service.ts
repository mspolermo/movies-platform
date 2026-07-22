import type {
  TGetPersonFilmsRequest,
  TPaginatedPersonsResponse,
  TPersonFilmsPaginationResponse,
  TPersonListItemResponse,
  TPersonProfileResponse,
} from "@common/types";
import type { FindOptions } from "sequelize";

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";

import { LIST_DEFAULT_LIMIT, LIST_MAX_LIMIT } from "@common/constants";

import { toPaginatedItemsResponse } from "../../common/utils/toPaginatedIemsResponse.util";
import { Profession } from "../../professions/models/professions.model";
import {
  mapFilmToPersonFilm,
  mapPersonToListItem,
  mapPersonToProfile,
} from "../mappers";
import { Person } from "../models";
import { normalizePersonListPagination } from "../utils/personsPagination.util";

const DEFAULT_FILMOGRAPHY_LIMIT = 10;

@Injectable()
export class PersonsService {
  constructor(
    @InjectModel(Person) private personRepository: typeof Person
  ) {}

  async getAllPersonsPaginated(
    page: number = 1,
    limit: number = LIST_DEFAULT_LIMIT
  ): Promise<TPaginatedPersonsResponse> {
    const {
      page: normalizedPage,
      limit: normalizedLimit,
      offset: normalizedOffset,
    } = normalizePersonListPagination(page, limit);

    const { rows, count } = await this.personRepository.findAndCountAll({
      include: [
        {
          model: Profession,
          through: { attributes: [] },
          attributes: [],
        },
      ],
      attributes: ["id", "photoUrl", "nameRu", "nameEn"],
      limit: normalizedLimit,
      offset: normalizedOffset,
      order: [["nameRu", "ASC"]],
      distinct: true,
      col: "id",
    });

    const items = rows.map((row) => mapPersonToListItem(row));
    const total = Array.isArray(count) ? count.length : count;

    return toPaginatedItemsResponse(
      items,
      total,
      normalizedPage,
      normalizedLimit
    );
  }

  async getPersonProfile(id: number): Promise<TPersonProfileResponse | null> {
    const person = await this.personRepository.findByPk(id, {
      attributes: ["id", "photoUrl", "nameRu", "nameEn"],
      include: [
        {
          model: Profession,
          attributes: ["id", "name"],
          through: { attributes: [] },
        },
      ],
    });

    if (!person) {
      return null;
    }

    return mapPersonToProfile(person);
  }

  async getPersonFilmography(
    request: TGetPersonFilmsRequest
  ): Promise<TPersonFilmsPaginationResponse | null> {
    const { id, limit: limitOpt, offset: offsetOpt } = request;
    const limitRaw = limitOpt ?? DEFAULT_FILMOGRAPHY_LIMIT;
    const offsetRaw = offsetOpt ?? 0;
    let limit = limitRaw > 0 ? limitRaw : DEFAULT_FILMOGRAPHY_LIMIT;
    limit = Math.min(limit, LIST_MAX_LIMIT);
    const offset = offsetRaw >= 0 ? offsetRaw : 0;

    const person = await this.personRepository.findByPk(id, {
      attributes: ["id"],
    });

    if (!person) {
      return null;
    }

    const total = await person.$count("films");
    const films = await person.$get("films", {
      attributes: [
        "id",
        "smallPictureUrl",
        "filmNameRu",
        "filmNameEn",
        "year",
        "ratingKp",
      ],
      limit,
      offset,
      order: [
        ["year", "DESC"],
        ["filmNameRu", "ASC"],
      ],
    });

    const items = films.map((film) => mapFilmToPersonFilm(film));
    const page = Math.floor(offset / limit) + 1;

    return toPaginatedItemsResponse(items, total, page, limit);
  }

  async findPersonsByNameAndProfession(
    personName?: string,
    professionId?: number
  ): Promise<TPersonListItemResponse[]> {
    const include: Array<{
      model: typeof Profession;
      through: { attributes: [] };
      attributes?: string[];
      where?: { id: number };
      required?: boolean;
    }> = [
      {
        model: Profession,
        through: { attributes: [] },
        attributes: [],
      },
    ];

    if (professionId) {
      include[0].where = { id: professionId };
      include[0].required = true;
    }

    const findOptions = {
      include,
      attributes: ["id", "photoUrl", "nameRu", "nameEn"],
      where: personName
        ? {
            [Op.or]: [
              {
                nameRu: {
                  [Op.iLike]: `%${personName}%`,
                },
              },
              {
                nameEn: {
                  [Op.iLike]: `%${personName}%`,
                },
              },
            ],
          }
        : {},
      limit: 20,
      distinct: true,
      col: "id",
      order: [["nameRu", "ASC"]],
    };
    const persons = await this.personRepository.findAll(
      findOptions as unknown as FindOptions
    );

    return persons.map((p) => mapPersonToListItem(p));
  }

  async getPersonsByProfessionId(
    professionId: number,
    page: number = 1,
    limit: number = LIST_DEFAULT_LIMIT
  ): Promise<TPaginatedPersonsResponse> {
    const {
      page: normalizedPage,
      limit: normalizedLimit,
      offset: normalizedOffset,
    } = normalizePersonListPagination(page, limit);

    const { rows, count } = await this.personRepository.findAndCountAll({
      include: [
        {
          model: Profession,
          through: { attributes: [] },
          where: { id: professionId },
          attributes: [],
          required: true,
        },
      ],
      attributes: ["id", "photoUrl", "nameRu", "nameEn"],
      limit: normalizedLimit,
      offset: normalizedOffset,
      order: [["nameRu", "ASC"]],
      distinct: true,
      col: "id",
    });

    const items = rows.map((row) => mapPersonToListItem(row));
    const total = Array.isArray(count) ? count.length : count;

    return toPaginatedItemsResponse(
      items,
      total,
      normalizedPage,
      normalizedLimit
    );
  }
}
