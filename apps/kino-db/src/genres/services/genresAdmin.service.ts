import type {
  TAdminGenresListResponse,
  TAdminListRequest,
  TCreateGenreRequest,
  TAdminGenreItemResponse,
  TUpdateGenreRequest,
} from "@common/types";

import { HttpStatus, Injectable } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { InjectModel } from "@nestjs/sequelize";
import { Op, col, fn, where } from "sequelize";

import {
  toAdminListParams,
  toILikeContains,
  toPaginatedItemsResponse,
} from "@common/utils";

import { rethrowUniqueAsConflict } from "../../common/utils";
import { FilmGenre } from "../../films/models";
import { mapGenreToAdminItem } from "../mappers";
import { Genre } from "../models";

/** Admin CRUD жанров (ADR-005/ADR-007). */
@Injectable()
export class GenresAdminService {
  constructor(
    @InjectModel(Genre) private readonly genreRepository: typeof Genre,
    @InjectModel(FilmGenre)
    private readonly filmGenreRepository: typeof FilmGenre
  ) {}

  /** Пагинированный список жанров с опциональным поиском по названиям. */
  async listGenres(
    request: TAdminListRequest
  ): Promise<TAdminGenresListResponse> {
    const { page, perPage, offset, q } = toAdminListParams(request);

    const like = q ? toILikeContains(q) : undefined;
    if (q && !like) {
      return toPaginatedItemsResponse([], 0, page, perPage);
    }

    const whereClause = like
      ? {
          [Op.or]: [
            { nameRu: { [Op.iLike]: like } },
            { nameEn: { [Op.iLike]: like } },
          ],
        }
      : undefined;

    const { rows, count } = await this.genreRepository.findAndCountAll({
      where: whereClause,
      order: [["nameRu", "ASC"]],
      limit: perPage,
      offset,
    });

    return toPaginatedItemsResponse(
      rows.map(mapGenreToAdminItem),
      count,
      page,
      perPage
    );
  }

  /** Создание жанра; дубликат nameRu/nameEn (без учёта регистра) → 409. */
  async createGenre(
    dto: TCreateGenreRequest
  ): Promise<TAdminGenreItemResponse> {
    await this.ensureNamesAreFree({ nameRu: dto.nameRu, nameEn: dto.nameEn });

    try {
      const genre = await this.genreRepository.create({ ...dto });
      return mapGenreToAdminItem(genre);
    } catch (error) {
      rethrowUniqueAsConflict(error, "Жанр с таким названием уже существует");
    }
  }

  /** Частичное обновление жанра; 404 если не найден, дубликат имени → 409. */
  async updateGenre(
    id: number,
    data: TUpdateGenreRequest
  ): Promise<TAdminGenreItemResponse> {
    const genre = await this.findGenreOrFail(id);

    if (data.nameRu !== undefined || data.nameEn !== undefined) {
      await this.ensureNamesAreFree(
        { nameRu: data.nameRu, nameEn: data.nameEn },
        id
      );
    }

    try {
      await genre.update({ ...data });
      return mapGenreToAdminItem(genre);
    } catch (error) {
      rethrowUniqueAsConflict(error, "Жанр с таким названием уже существует");
    }
  }

  /** Удаление жанра; привязан к фильмам → 409 (Restrict, ADR-007). */
  async deleteGenre(id: number): Promise<true> {
    const genre = await this.findGenreOrFail(id);

    const filmsCount = await this.filmGenreRepository.count({
      where: { genreId: id },
    });

    if (filmsCount > 0) {
      throw new RpcException({
        statusCode: HttpStatus.CONFLICT,
        message: `Жанр привязан к фильмам (${filmsCount}) — удаление запрещено`,
      });
    }

    await genre.destroy();
    return true;
  }

  /** Жанр по id или RpcException 404. */
  private async findGenreOrFail(id: number): Promise<Genre> {
    const genre = await this.genreRepository.findByPk(id);

    if (!genre) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: "Жанр не найден",
      });
    }

    return genre;
  }

  /** Уникальность nameRu / nameEn без учёта регистра; excludeId — при update. */
  private async ensureNamesAreFree(
    names: { nameRu?: string; nameEn?: string },
    excludeId?: number
  ): Promise<void> {
    const sameNameChecks = [
      names.nameRu !== undefined
        ? where(fn("LOWER", col("nameRu")), names.nameRu.toLowerCase())
        : null,
      names.nameEn !== undefined
        ? where(fn("LOWER", col("nameEn")), names.nameEn.toLowerCase())
        : null,
    ].filter((clause): clause is NonNullable<typeof clause> => clause != null);

    if (sameNameChecks.length === 0) {
      return;
    }

    const duplicate = await this.genreRepository.findOne({
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
        message: "Жанр с таким названием уже существует",
      });
    }
  }
}
