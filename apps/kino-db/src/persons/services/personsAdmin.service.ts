import type {
  TAdminListRequest,
  TAdminPersonsListResponse,
  TCreatePersonRequest,
  TPersonAdminItemResponse,
  TUpdatePersonRequest,
} from "@common/types";

import { HttpStatus, Injectable } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import { Sequelize } from "sequelize-typescript";

import { toAdminListParams, toPaginatedItemsResponse } from "@common/utils";

import { FilmPerson } from "../../films/models";
import { Profession } from "../../professions/models";
import { mapPersonToAdminItem } from "../mappers";
import { Person, PersonProfession } from "../models";

/** Admin CRUD персон + связь с профессиями (ADR-005/ADR-007). */
@Injectable()
export class PersonsAdminService {
  constructor(
    @InjectModel(Person) private readonly personRepository: typeof Person,
    @InjectModel(Profession)
    private readonly professionRepository: typeof Profession,
    @InjectModel(PersonProfession)
    private readonly personProfessionRepository: typeof PersonProfession,
    @InjectModel(FilmPerson)
    private readonly filmPersonRepository: typeof FilmPerson,
    private readonly sequelize: Sequelize
  ) {}

  /** Пагинированный список персон с серверным поиском по имени (61k строк — см. ADR-007). */
  async listPersons(
    request: TAdminListRequest
  ): Promise<TAdminPersonsListResponse> {
    const { page, perPage, offset, q } = toAdminListParams(request);

    const where = q
      ? {
          [Op.or]: [
            { nameRu: { [Op.iLike]: `%${q}%` } },
            { nameEn: { [Op.iLike]: `%${q}%` } },
          ],
        }
      : undefined;

    const { rows, count } = await this.personRepository.findAndCountAll({
      where,
      include: [{ model: Profession, through: { attributes: [] } }],
      order: [["nameRu", "ASC"]],
      limit: perPage,
      offset,
      // BelongsToMany join задваивает count без distinct
      distinct: true,
    });

    return toPaginatedItemsResponse(
      rows.map(mapPersonToAdminItem),
      count,
      page,
      perPage
    );
  }

  /** Персона по id (с professionIds); 404 если не найдена. */
  async getPersonById(id: number): Promise<TPersonAdminItemResponse> {
    const person = await this.findPersonOrFail(id);
    return mapPersonToAdminItem(person);
  }

  /** Создание персоны + привязка профессий. */
  async createPerson(
    dto: TCreatePersonRequest
  ): Promise<TPersonAdminItemResponse> {
    await this.ensureProfessionsExist(dto.professionIds);

    const person = await this.personRepository.create({
      nameRu: dto.nameRu,
      nameEn: dto.nameEn,
      photoUrl: dto.photoUrl,
    });
    await person.$set("professions", dto.professionIds);

    return this.getPersonById(person.id);
  }

  /** Частичное обновление персоны; `photoUrl: null` — очистить; sync профессий через $set. */
  async updatePerson(
    id: number,
    data: TUpdatePersonRequest
  ): Promise<TPersonAdminItemResponse> {
    const person = await this.findPersonOrFail(id);

    const { professionIds, ...scalars } = data;

    if (professionIds !== undefined) {
      await this.ensureProfessionsExist(professionIds);
    }

    if (Object.keys(scalars).length > 0) {
      await person.update(scalars as Partial<Person>);
    }

    if (professionIds !== undefined) {
      await person.$set("professions", professionIds);
    }

    return this.getPersonById(id);
  }

  /** Удаление персоны; занята в фильмах → 409 (Restrict, ADR-007). */
  async deletePerson(id: number): Promise<true> {
    const person = await this.findPersonOrFail(id);

    const filmsCount = await this.filmPersonRepository.count({
      where: { personId: id },
    });

    if (filmsCount > 0) {
      throw new RpcException({
        statusCode: HttpStatus.CONFLICT,
        message: `Персона участвует в фильмах (${filmsCount}) — удаление запрещено`,
      });
    }

    await this.sequelize.transaction(async (transaction) => {
      // PersonProfession: колонка A — personId (легаси-схема A/B, см. B7)
      await this.personProfessionRepository.destroy({
        where: { A: id },
        transaction,
      });
      await person.destroy({ transaction });
    });

    return true;
  }

  /** Персона по id (с профессиями) или RpcException 404. */
  private async findPersonOrFail(id: number): Promise<Person> {
    const person = await this.personRepository.findByPk(id, {
      include: [{ model: Profession, through: { attributes: [] } }],
    });

    if (!person) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: "Персона не найдена",
      });
    }

    return person;
  }

  /** Все professionIds существуют, иначе 400 (защита от сырой FK-ошибки). */
  private async ensureProfessionsExist(
    professionIds: number[]
  ): Promise<void> {
    const uniqueIds = [...new Set(professionIds)];

    if (uniqueIds.length === 0) {
      return;
    }

    const count = await this.professionRepository.count({
      where: { id: uniqueIds },
    });

    if (count !== uniqueIds.length) {
      throw new RpcException({
        statusCode: HttpStatus.BAD_REQUEST,
        message: "Некоторые профессии из professionIds не существуют",
      });
    }
  }
}
