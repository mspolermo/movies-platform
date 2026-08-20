import type {
  TAdminCountriesListResponse,
  TAdminListRequest,
  TAdminCountryItemResponse,
  TCreateCountryRequest,
  TUpdateCountryRequest,
} from "@common/types";

import { HttpStatus, Injectable } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { InjectModel } from "@nestjs/sequelize";
import { Op, col, fn, where } from "sequelize";

import {
  toAdminListParams,
  toILikeContains,
  toPaginatedItemsResponse,
  rethrowUniqueAsConflict
} from "@common/utils";

import { FilmCountry } from "../../films/models";
import { mapCountryToAdminItem } from "../mappers";
import { Country } from "../models";

/** Admin CRUD стран (ADR-005/ADR-007). */
@Injectable()
export class CountriesAdminService {
  constructor(
    @InjectModel(Country) private readonly countryRepository: typeof Country,
    @InjectModel(FilmCountry)
    private readonly filmCountryRepository: typeof FilmCountry
  ) {}

  /** Пагинированный список стран с опциональным поиском по названиям. */
  async listCountries(
    request: TAdminListRequest
  ): Promise<TAdminCountriesListResponse> {
    const { page, perPage, offset, q } = toAdminListParams(request);

    const like = q ? toILikeContains(q) : undefined;
    if (q && !like) {
      return toPaginatedItemsResponse([], 0, page, perPage);
    }

    const whereClause = like
      ? {
          [Op.or]: [
            { countryName: { [Op.iLike]: like } },
            { countryNameEn: { [Op.iLike]: like } },
          ],
        }
      : undefined;

    const { rows, count } = await this.countryRepository.findAndCountAll({
      where: whereClause,
      order: [["countryName", "ASC"]],
      limit: perPage,
      offset,
    });

    return toPaginatedItemsResponse(
      rows.map(mapCountryToAdminItem),
      count,
      page,
      perPage
    );
  }

  /** Создание страны; дубликат имени (RU/EN, без учёта регистра) → 409. */
  async createCountry(
    dto: TCreateCountryRequest
  ): Promise<TAdminCountryItemResponse> {
    await this.ensureNamesAreFree({
      countryName: dto.countryName,
      countryNameEn: dto.countryNameEn,
    });

    try {
      const country = await this.countryRepository.create({ ...dto });
      return mapCountryToAdminItem(country);
    } catch (error) {
      rethrowUniqueAsConflict(
        error,
        "Страна с таким названием уже существует"
      );
    }
  }

  /** Частичное обновление страны; 404 если не найдена, дубликат имени → 409. */
  async updateCountry(
    id: number,
    data: TUpdateCountryRequest
  ): Promise<TAdminCountryItemResponse> {
    const country = await this.findCountryOrFail(id);

    if (data.countryName !== undefined || data.countryNameEn !== undefined) {
      await this.ensureNamesAreFree(
        {
          countryName: data.countryName,
          countryNameEn: data.countryNameEn,
        },
        id
      );
    }

    try {
      await country.update({ ...data });
      return mapCountryToAdminItem(country);
    } catch (error) {
      rethrowUniqueAsConflict(
        error,
        "Страна с таким названием уже существует"
      );
    }
  }

  /** Удаление страны; привязана к фильмам → 409 (Restrict, ADR-007). */
  async deleteCountry(id: number): Promise<true> {
    const country = await this.findCountryOrFail(id);

    const filmsCount = await this.filmCountryRepository.count({
      where: { countryId: id },
    });

    if (filmsCount > 0) {
      throw new RpcException({
        statusCode: HttpStatus.CONFLICT,
        message: `Страна привязана к фильмам (${filmsCount}) — удаление запрещено`,
      });
    }

    await country.destroy();
    return true;
  }

  /** Страна по id или RpcException 404. */
  private async findCountryOrFail(id: number): Promise<Country> {
    const country = await this.countryRepository.findByPk(id);

    if (!country) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: "Страна не найдена",
      });
    }

    return country;
  }

  /** Уникальность countryName / countryNameEn без учёта регистра; excludeId — при update. */
  private async ensureNamesAreFree(
    names: { countryName?: string; countryNameEn?: string },
    excludeId?: number
  ): Promise<void> {
    const sameNameChecks = [
      names.countryName !== undefined
        ? where(
            fn("LOWER", col("countryName")),
            names.countryName.toLowerCase()
          )
        : null,
      names.countryNameEn !== undefined
        ? where(
            fn("LOWER", col("countryNameEn")),
            names.countryNameEn.toLowerCase()
          )
        : null,
    ].filter((clause): clause is NonNullable<typeof clause> => clause != null);

    if (sameNameChecks.length === 0) {
      return;
    }

    const duplicate = await this.countryRepository.findOne({
      where: {
        [Op.and]: [
          { [Op.or]: sameNameChecks },
          ...(excludeId !== undefined
            ? [{ id: { [Op.ne]: excludeId } }]
            : []),
        ],
      },
    });

    if (duplicate) {
      throw new RpcException({
        statusCode: HttpStatus.CONFLICT,
        message: "Страна с таким названием уже существует",
      });
    }
  }
}
