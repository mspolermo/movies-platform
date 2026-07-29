import type {
  TAdminGenresListResponse,
  TAdminListRequest,
  TCreateGenreRequest,
  TGenreAdminItemResponse,
  TUpdateGenreRequest,
} from "@common/types";

import { HttpStatus, Injectable } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { InjectModel } from "@nestjs/sequelize";
import { Op, col, fn, where } from "sequelize";

import { toAdminListParams, toPaginatedItemsResponse } from "@common/utils";

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

  /** Пагинированный список жанров с id. */
  async listGenres(
    request: TAdminListRequest
  ): Promise<TAdminGenresListResponse> {
    const { page, perPage, offset } = toAdminListParams(request);

    const { rows, count } = await this.genreRepository.findAndCountAll({
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

  /** Создание жанра; дубликат nameRu (без учёта регистра) → 409. */
  async createGenre(
    dto: TCreateGenreRequest
  ): Promise<TGenreAdminItemResponse> {
    await this.ensureNameIsFree(dto.nameRu);
    const genre = await this.genreRepository.create({ ...dto });
    return mapGenreToAdminItem(genre);
  }

  /** Частичное обновление жанра; 404 если не найден, дубликат имени → 409. */
  async updateGenre(
    id: number,
    data: TUpdateGenreRequest
  ): Promise<TGenreAdminItemResponse> {
    const genre = await this.findGenreOrFail(id);

    if (data.nameRu !== undefined) {
      await this.ensureNameIsFree(data.nameRu, id);
    }

    await genre.update({ ...data });
    return mapGenreToAdminItem(genre);
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

  /** Уникальность nameRu без учёта регистра; excludeId — при update. */
  private async ensureNameIsFree(
    nameRu: string,
    excludeId?: number
  ): Promise<void> {
    const sameName = where(fn("LOWER", col("nameRu")), nameRu.toLowerCase());
    const duplicate = await this.genreRepository.findOne({
      where:
        excludeId === undefined
          ? sameName
          : { [Op.and]: [sameName, { id: { [Op.ne]: excludeId } }] },
    });

    if (duplicate) {
      throw new RpcException({
        statusCode: HttpStatus.CONFLICT,
        message: "Жанр с таким названием уже существует",
      });
    }
  }
}
