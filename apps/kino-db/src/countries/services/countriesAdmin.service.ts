import type {
  TAdminCountriesListResponse,
  TAdminListRequest,
  TCountryAdminItemResponse,
  TCreateCountryRequest,
  TUpdateCountryRequest,
} from "@common/types";

import { HttpStatus, Injectable } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { InjectModel } from "@nestjs/sequelize";
import { Op, col, fn, where } from "sequelize";

import { toAdminListParams, toPaginatedItemsResponse } from "@common/utils";

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

  /** Пагинированный список стран с id. */
  async listCountries(
    request: TAdminListRequest
  ): Promise<TAdminCountriesListResponse> {
    const { page, perPage, offset } = toAdminListParams(request);

    const { rows, count } = await this.countryRepository.findAndCountAll({
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

  /** Создание страны; дубликат countryName (без учёта регистра) → 409. */
  async createCountry(
    dto: TCreateCountryRequest
  ): Promise<TCountryAdminItemResponse> {
    await this.ensureNameIsFree(dto.countryName);
    const country = await this.countryRepository.create({ ...dto });
    return mapCountryToAdminItem(country);
  }

  /** Частичное обновление страны; 404 если не найдена, дубликат имени → 409. */
  async updateCountry(
    id: number,
    data: TUpdateCountryRequest
  ): Promise<TCountryAdminItemResponse> {
    const country = await this.findCountryOrFail(id);

    if (data.countryName !== undefined) {
      await this.ensureNameIsFree(data.countryName, id);
    }

    await country.update({ ...data });
    return mapCountryToAdminItem(country);
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

  /** Уникальность countryName без учёта регистра; excludeId — при update. */
  private async ensureNameIsFree(
    countryName: string,
    excludeId?: number
  ): Promise<void> {
    const sameName = where(
      fn("LOWER", col("countryName")),
      countryName.toLowerCase()
    );
    const duplicate = await this.countryRepository.findOne({
      where:
        excludeId === undefined
          ? sameName
          : { [Op.and]: [sameName, { id: { [Op.ne]: excludeId } }] },
    });

    if (duplicate) {
      throw new RpcException({
        statusCode: HttpStatus.CONFLICT,
        message: "Страна с таким названием уже существует",
      });
    }
  }
}
