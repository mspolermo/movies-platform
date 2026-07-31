import type {
  TUpsertFilmRatingRpcRequest,
  TDeleteFilmRatingRpcRequest,
  TListFilmRatingsRpcRequest,
  TFilmRatingGradesRpcRequest,
  TUpsertFilmRatingResponse,
  TDeleteFilmRatingResponse,
  TMyFilmRatingsResponse,
  TMyFilmRatingGradesResponse,
} from "@common/types";

import { Injectable } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { InjectConnection, InjectModel } from "@nestjs/sequelize";
import { QueryTypes, Sequelize, UniqueConstraintError } from "sequelize";

import {
  FILM_USER_GRADE_MAX,
  FILM_USER_GRADE_MIN,
} from "@common/constants";
import { toListParams, toPaginatedItemsResponse } from "@common/utils";

import { assertRpcPositiveInt } from "../../shared";
import {
  mapRatingToItemResponse,
  mapRatingsToGradesResponse,
} from "../mappers";
import { UserFilmRating } from "../models";

@Injectable()
export class RatingsService {
  constructor(
    @InjectModel(UserFilmRating)
    private readonly ratingRepository: typeof UserFilmRating,
    @InjectConnection()
    private readonly sequelize: Sequelize
  ) {}

  /**
   * Создать или обновить оценку фильма.
   * Сериализация через pg_advisory_xact_lock(userId, filmId) —
   * иначе race upsert↔delete / параллельный create.
   */
  async upsert(
    request: TUpsertFilmRatingRpcRequest
  ): Promise<TUpsertFilmRatingResponse> {
    const { userId, filmId, grade } = request;
    assertRpcPositiveInt(userId, "userId");
    assertRpcPositiveInt(filmId, "filmId");

    if (
      !Number.isInteger(grade) ||
      grade < FILM_USER_GRADE_MIN ||
      grade > FILM_USER_GRADE_MAX
    ) {
      throw new RpcException({
        statusCode: 400,
        message: `Оценка должна быть целым числом от ${FILM_USER_GRADE_MIN} до ${FILM_USER_GRADE_MAX}`,
      });
    }

    return this.sequelize.transaction(async (transaction) => {
      await this.sequelize.query(
        "SELECT pg_advisory_xact_lock(:userId, :filmId)",
        {
          replacements: { userId, filmId },
          type: QueryTypes.SELECT,
          transaction,
        }
      );

      const existing = await this.ratingRepository.findOne({
        where: { userId, filmId },
        transaction,
      });

      if (existing) {
        await existing.update({ grade }, { transaction });
        await existing.reload({ transaction });
        return mapRatingToItemResponse(existing);
      }

      try {
        const created = await this.ratingRepository.create(
          { userId, filmId, grade },
          { transaction }
        );
        return mapRatingToItemResponse(created);
      } catch (error) {
        // Защита на случай обхода advisory (другой путь записи).
        if (error instanceof UniqueConstraintError) {
          const concurrent = await this.ratingRepository.findOne({
            where: { userId, filmId },
            transaction,
          });

          if (!concurrent) {
            throw error;
          }

          await concurrent.update({ grade }, { transaction });
          await concurrent.reload({ transaction });
          return mapRatingToItemResponse(concurrent);
        }
        throw error;
      }
    });
  }

  /**
   * Удалить оценку; deleted=false если записи не было.
   * Тот же advisory lock, что и upsert — иначе race upsert↔delete.
   */
  async delete(
    request: TDeleteFilmRatingRpcRequest
  ): Promise<TDeleteFilmRatingResponse> {
    const { userId, filmId } = request;
    assertRpcPositiveInt(userId, "userId");
    assertRpcPositiveInt(filmId, "filmId");

    return this.sequelize.transaction(async (transaction) => {
      await this.sequelize.query(
        "SELECT pg_advisory_xact_lock(:userId, :filmId)",
        {
          replacements: { userId, filmId },
          type: QueryTypes.SELECT,
          transaction,
        }
      );

      const deletedCount = await this.ratingRepository.destroy({
        where: { userId, filmId },
        transaction,
      });

      return { deleted: deletedCount > 0 };
    });
  }

  /** Пагинированный список оценок пользователя. */
  async list(
    request: TListFilmRatingsRpcRequest
  ): Promise<TMyFilmRatingsResponse> {
    assertRpcPositiveInt(request.userId, "userId");

    const { userId } = request;
    const { page, perPage, offset } = toListParams(request);

    const { rows, count } = await this.ratingRepository.findAndCountAll({
      where: { userId },
      order: [
        ["updatedAt", "DESC"],
        ["id", "DESC"],
      ],
      limit: perPage,
      offset,
    });

    return toPaginatedItemsResponse(
      rows.map(mapRatingToItemResponse),
      count,
      page,
      perPage
    );
  }

  /** Все оценки пользователя для hydrate панели. */
  async grades(
    request: TFilmRatingGradesRpcRequest
  ): Promise<TMyFilmRatingGradesResponse> {
    assertRpcPositiveInt(request.userId, "userId");

    const ratings = await this.ratingRepository.findAll({
      where: { userId: request.userId },
      attributes: ["filmId", "grade"],
    });

    return mapRatingsToGradesResponse(ratings);
  }
}
