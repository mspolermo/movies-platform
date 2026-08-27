import type {
  TAdminFilmItemResponse,
  TAdminFilmsListResponse,
  TAdminListRequest,
  TCreateFilmRequest,
  TUpdateFilmRequest,
} from "@common/types";
import type { TFilmCreationAtt, TFilmOrmModel } from "@common/types/orm";

import { HttpStatus, Injectable } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import { Sequelize } from "sequelize-typescript";

import {
  toAdminListParams,
  toILikeContains,
  toPaginatedItemsResponse,
} from "@common/utils";

import { CommentLike } from "../../comments/models/commentLike.model";
import { Comment } from "../../comments/models/comments.model";
import { mapFilmToAdminItem } from "../mappers";
import { Fact, Film, FilmCountry, FilmGenre, FilmPerson } from "../models";

@Injectable()
export class FilmsAdminService {
  constructor(
    @InjectModel(Film) private readonly filmRepository: typeof Film,
    @InjectModel(FilmGenre)
    private readonly filmGenreRepository: typeof FilmGenre,
    @InjectModel(FilmCountry)
    private readonly filmCountryRepository: typeof FilmCountry,
    @InjectModel(FilmPerson)
    private readonly filmPersonRepository: typeof FilmPerson,
    @InjectModel(Fact) private readonly factRepository: typeof Fact,
    @InjectModel(Comment) private readonly commentRepository: typeof Comment,
    @InjectModel(CommentLike)
    private readonly commentLikeRepository: typeof CommentLike,
    private readonly sequelize: Sequelize
  ) {}

  async listFilms(request: TAdminListRequest): Promise<TAdminFilmsListResponse> {
    const { page, perPage, offset, q } = toAdminListParams(request);

    const like = q ? toILikeContains(q) : undefined;
    if (q && !like) {
      return toPaginatedItemsResponse([], 0, page, perPage);
    }

    const where = like
      ? {
          [Op.or]: [
            { filmNameRu: { [Op.iLike]: like } },
            { filmNameEn: { [Op.iLike]: like } },
          ],
        }
      : undefined;

    const { rows, count } = await this.filmRepository.findAndCountAll({
      where,
      order: [["filmNameRu", "ASC"]],
      limit: perPage,
      offset,
    });

    return toPaginatedItemsResponse(
      rows.map(mapFilmToAdminItem),
      count,
      page,
      perPage
    );
  }

  async getFilmById(id: number): Promise<TAdminFilmItemResponse> {
    const film = await this.findFilmOrFail(id);
    return mapFilmToAdminItem(film);
  }

  async createFilm(dto: TCreateFilmRequest): Promise<TAdminFilmItemResponse> {
    const film = await this.filmRepository.create(
          //TODO: так быть не должно - никаких приведений типов и использовании ORM типа в сервисе
      this.toWriteValues(dto) as TFilmCreationAtt
    );
    return mapFilmToAdminItem(film);
  }

  async updateFilm(
    id: number,
    data: TUpdateFilmRequest
  ): Promise<TAdminFilmItemResponse> {
    const film = await this.findFilmOrFail(id);
    //TODO: так быть не должно - никаких приведений типов и использовании ORM типа в сервисе
    await film.update(this.toWriteValues(data) as Partial<TFilmOrmModel>);
    return mapFilmToAdminItem(film);
  }

  /**
   * Удаление фильма каскадом (ADR-007): commentLikes → comments →
   * join-строки (жанры/страны/персоны) и facts → film. Одна транзакция.
   */
  async deleteFilm(id: number): Promise<true> {
    const film = await this.findFilmOrFail(id);

    await this.sequelize.transaction(async (transaction) => {
      const comments = await this.commentRepository.findAll({
        where: { filmId: id },
        attributes: ["id"],
        transaction,
      });
      const commentIds = comments.map((comment) => comment.id);

      if (commentIds.length > 0) {
        await this.commentLikeRepository.destroy({
          where: { commentId: commentIds },
          transaction,
        });
        await this.commentRepository.destroy({
          where: { filmId: id },
          transaction,
        });
      }

      await this.filmGenreRepository.destroy({
        where: { filmId: id },
        transaction,
      });
      await this.filmCountryRepository.destroy({
        where: { filmId: id },
        transaction,
      });
      await this.filmPersonRepository.destroy({
        where: { filmId: id },
        transaction,
      });
      await this.factRepository.destroy({ where: { filmId: id }, transaction });

      await film.destroy({ transaction });
    });

    return true;
  }

  private async findFilmOrFail(id: number): Promise<Film> {
    const film = await this.filmRepository.findByPk(id);

    if (!film) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: "Фильм не найден",
      });
    }

    return film;
  }

  private toWriteValues(
    data: TCreateFilmRequest | TUpdateFilmRequest
  ): Record<string, unknown> {
    const { premiereWorldDate, ...rest } = data;
    const values: Record<string, unknown> = { ...rest };

    if (premiereWorldDate !== undefined) {
      values.premiereWorldDate =
        premiereWorldDate === null ? null : new Date(premiereWorldDate);
    }

    return values;
  }
}
