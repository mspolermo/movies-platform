import type {
  TAdminListRequest,
  TAdminProfessionsListResponse,
  TCreateProfessionRequest,
  TAdminProfessionItemResponse,
  TUpdateProfessionRequest,
} from "@common/types";

import { HttpStatus, Injectable } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { InjectModel } from "@nestjs/sequelize";
import { Op, col, fn, where } from "sequelize";

import { toAdminListParams, toPaginatedItemsResponse, rethrowUniqueAsConflict } from "@common/utils";

import { PersonProfession } from "../../persons/models";
import { mapProfessionToAdminItem } from "../mappers";
import { Profession } from "../models";

/** Admin CRUD профессий (ADR-005/ADR-007). */
@Injectable()
export class ProfessionsAdminService {
  constructor(
    @InjectModel(Profession)
    private readonly professionRepository: typeof Profession,
    @InjectModel(PersonProfession)
    private readonly personProfessionRepository: typeof PersonProfession
  ) {}

  /** Пагинированный список профессий с id. */
  async listProfessions(
    request: TAdminListRequest
  ): Promise<TAdminProfessionsListResponse> {
    const { page, perPage, offset } = toAdminListParams(request);

    const { rows, count } = await this.professionRepository.findAndCountAll({
      order: [["name", "ASC"]],
      limit: perPage,
      offset,
    });

    return toPaginatedItemsResponse(
      rows.map(mapProfessionToAdminItem),
      count,
      page,
      perPage
    );
  }

  /** Создание профессии; дубликат name (без учёта регистра) → 409. */
  async createProfession(
    dto: TCreateProfessionRequest
  ): Promise<TAdminProfessionItemResponse> {
    await this.ensureNameIsFree(dto.name);

    try {
      const profession = await this.professionRepository.create({ ...dto });
      return mapProfessionToAdminItem(profession);
    } catch (error) {
      rethrowUniqueAsConflict(
        error,
        "Профессия с таким названием уже существует"
      );
    }
  }

  /** Частичное обновление профессии; 404 если не найдена, дубликат имени → 409. */
  async updateProfession(
    id: number,
    data: TUpdateProfessionRequest
  ): Promise<TAdminProfessionItemResponse> {
    const profession = await this.findProfessionOrFail(id);

    if (data.name !== undefined) {
      await this.ensureNameIsFree(data.name, id);
    }

    try {
      await profession.update({ ...data });
      return mapProfessionToAdminItem(profession);
    } catch (error) {
      rethrowUniqueAsConflict(
        error,
        "Профессия с таким названием уже существует"
      );
    }
  }

  /** Удаление профессии; используется персонами → 409 (Restrict, ADR-007). */
  async deleteProfession(id: number): Promise<true> {
    const profession = await this.findProfessionOrFail(id);

    // PersonProfession: колонка B — professionId (легаси-схема A/B, см. B7)
    const personsCount = await this.personProfessionRepository.count({
      where: { B: id },
    });

    if (personsCount > 0) {
      throw new RpcException({
        statusCode: HttpStatus.CONFLICT,
        message: `Профессия используется персонами (${personsCount}) — удаление запрещено`,
      });
    }

    await profession.destroy();
    return true;
  }

  /** Профессия по id или RpcException 404. */
  private async findProfessionOrFail(id: number): Promise<Profession> {
    const profession = await this.professionRepository.findByPk(id);

    if (!profession) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: "Профессия не найдена",
      });
    }

    return profession;
  }

  /** Уникальность name без учёта регистра; excludeId — при update. */
  private async ensureNameIsFree(
    name: string,
    excludeId?: number
  ): Promise<void> {
    const sameName = where(fn("LOWER", col("name")), name.toLowerCase());
    const duplicate = await this.professionRepository.findOne({
      where:
        excludeId === undefined
          ? sameName
          : { [Op.and]: [sameName, { id: { [Op.ne]: excludeId } }] },
    });

    if (duplicate) {
      throw new RpcException({
        statusCode: HttpStatus.CONFLICT,
        message: "Профессия с таким названием уже существует",
      });
    }
  }
}
