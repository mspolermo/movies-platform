import type {
  TGetPersonFilmographyRequest,
  TPaginatedPersonsResponse,
  TPersonFilmographyResponse,
  TPersonListItemResponse,
  TPersonProfileResponse,
} from "@common/types";

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";

import { Profession } from "../professions/professions.model";

import { Person } from "./persons.model";

const DEFAULT_FILMOGRAPHY_LIMIT = 10;

@Injectable()
export class PersonsService {
  constructor(
    @InjectModel(Person) private personRepository: typeof Person
  ) {}

  async getAllPersonsPaginated(
    page: number = 1,
    limit: number = 20
  ): Promise<TPaginatedPersonsResponse> {
    const normalizedLimit = limit > 0 && limit <= 100 ? limit : 20;
    const normalizedPage = page > 0 ? page : 1;
    const normalizedOffset = (normalizedPage - 1) * normalizedLimit;

    const [persons, total] = await Promise.all([
      this.personRepository.findAll({
        include: [
          {
            model: Profession,
            through: { attributes: [] },
            attributes: [],
          },
        ],
        attributes: ['id', 'photoUrl', 'nameRu', 'nameEn'],
        limit: normalizedLimit,
        offset: normalizedOffset,
        order: [['nameRu', 'ASC']],
      }),
      this.personRepository.count(),
    ]);

    const hasMore = normalizedOffset + persons.length < total;

    return {
      items: persons,
      total,
      hasMore,
    };
  }

  async getPersonProfile(id: number): Promise<TPersonProfileResponse | null> {
    const person = await this.personRepository.findByPk(id, {
      attributes: ['id', 'photoUrl', 'nameRu', 'nameEn'],
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

    return person.get({ plain: true }) as TPersonProfileResponse;
  }

  async getPersonFilmography(
    request: TGetPersonFilmographyRequest
  ): Promise<TPersonFilmographyResponse | null> {
    const { id, limit: limitOpt, offset: offsetOpt } = request;
    const limitRaw = limitOpt ?? DEFAULT_FILMOGRAPHY_LIMIT;
    const offsetRaw = offsetOpt ?? 0;
    const limit = limitRaw > 0 ? limitRaw : DEFAULT_FILMOGRAPHY_LIMIT;
    const offset = offsetRaw >= 0 ? offsetRaw : 0;

    const person = await this.personRepository.findByPk(id, {
      attributes: ['id'],
    });

    if (!person) {
      return null;
    }

    const total = await person.$count("films");
    const items = await person.$get("films", {
      attributes: ['id', 'smallPictureUrl', 'filmNameRu', 'filmNameEn', 'year', 'ratingKp'],
      limit,
      offset,
      order: [
        ['year', 'DESC'],
        ['filmNameRu', 'ASC'],
      ],
    });

    const page = Math.floor(offset / limit) + 1;
    const hasMore = offset + items.length < total;

    return {
      items,
      total,
      page,
      perPage: limit,
      hasMore,
    };
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

    // Добавляем условие для профессии только если professionId передан
    if (professionId) {
      include[0].where = { id: professionId };
      include[0].required = true;
    }

    const persons = await this.personRepository.findAll({
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
    });
    return persons;
  }

  async getPersonsByProfessionId(
    professionId: number,
    page: number = 1,
    limit: number = 20
  ): Promise<TPaginatedPersonsResponse> {
    const normalizedLimit = limit > 0 && limit <= 100 ? limit : 20;
    const normalizedPage = page > 0 ? page : 1;
    const normalizedOffset = (normalizedPage - 1) * normalizedLimit;

    const [persons, total] = await Promise.all([
      this.personRepository.findAll({
        include: [
          {
            model: Profession,
            through: { attributes: [] },
            where: { id: professionId },
            attributes: [],
            required: true,
          },
        ],
        attributes: ['id', 'photoUrl', 'nameRu', 'nameEn'],
        limit: normalizedLimit,
        offset: normalizedOffset,
        order: [['nameRu', 'ASC']],
      }),
      this.personRepository.count({
        include: [
          {
            model: Profession,
            through: { attributes: [] },
            where: { id: professionId },
            attributes: [],
            required: true,
          },
        ],
      }),
    ]);

    const hasMore = normalizedOffset + persons.length < total;

    return {
      items: persons,
      total,
      hasMore,
    };
  }

}
