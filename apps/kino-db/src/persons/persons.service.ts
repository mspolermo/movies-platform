import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Person } from "./persons.model";
import { ProfessionsService } from "../professions/professions.service";
import {
  TPaginatedPersonsResponse,
  TPersonDetailsResponse,
  TPersonListItemResponse,
} from "@common/types";
import {
  TProfessionModel,
  TProfessionBased,
} from "@common/types";
import { Profession } from "../professions/professions.model";
import { Op } from "sequelize";

@Injectable()
export class PersonsService {
  constructor(
    @InjectModel(Person) private personRepository: typeof Person,
    private professionService: ProfessionsService
  ) {}

  async getAllPersons(): Promise<TPersonListItemResponse[]> {
    const persons = await this.personRepository.findAll({
      include: [
        {
          model: Profession,
          attributes: [],
          through: { attributes: [] },
        },
      ],
      attributes: ['id', 'photoUrl', 'nameRu', 'nameEn'],
      limit: 10
    });
    return persons;
  }

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

  async getPersonById(
    id: number,
    options?: { filmsLimit?: number; filmsOffset?: number }
  ): Promise<TPersonDetailsResponse | null> {
    const filmsLimitRaw = options?.filmsLimit ?? 10;
    const filmsOffsetRaw = options?.filmsOffset ?? 0;
    const filmsLimit = filmsLimitRaw > 0 ? filmsLimitRaw : 10;
    const filmsOffset = filmsOffsetRaw >= 0 ? filmsOffsetRaw : 0;

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

    const filmsTotal = await person.$count("films");
    const films = await person.$get("films", {
      attributes: ['id', 'smallPictureUrl', 'filmNameRu', 'filmNameEn', 'year', 'ratingKp'],
      limit: filmsLimit,
      offset: filmsOffset,
      order: [
        ['year', 'DESC'],
        ['filmNameRu', 'ASC'],
      ],
    });

    return {
      ...person.get({ plain: true }),
      films,
      filmsTotal,
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

  async createPerson(dto: { photoUrl: string; nameRu: string; nameEn: string; professions?: TProfessionBased[] }): Promise<Person> {
    const person = await this.personRepository.create(dto);
    if (dto.professions && dto.professions.length > 0) {
      const professionsNames = dto.professions.map((p: TProfessionBased) => p.name);
      const professions = await this.professionService.findProfessionByName(
        professionsNames
      );
      if (professions.some(p => p === null)) {
        throw new Error("One or more professions not found");
      }
      const professionIds = professions.map((p: TProfessionModel) => p.id);
      await person.$set("professions", professionIds);
      // Приводим к правильному типу для Sequelize модели
      person.professions = professions as Profession[];
    }
    return person;
  }

  async createManyPersons(dtos: { photoUrl: string; nameRu: string; nameEn: string; professions?: TProfessionBased[] }[]): Promise<Person[]> {
    const persons = await this.personRepository.bulkCreate(dtos);
    if (dtos.some((dto) => dto.professions && dto.professions.length > 0)) {
      const professionsNames = dtos.flatMap((p) =>
        p.professions?.map((pr: TProfessionBased) => pr.name) || []
      );
      const professions = await this.professionService.findProfessionByName(
        professionsNames
      );
      if (professions.some(p => p === null)) {
        throw new Error("One or more professions not found");
      }
      const professionIds = professions.map((p: TProfessionModel) => p.id);
      for (const person of persons) {
        await person.$set("professions", professionIds);
      }
    }
    return persons;
  }
}
