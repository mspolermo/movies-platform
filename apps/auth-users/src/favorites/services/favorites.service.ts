import type {
  TListFavoritesRpcRequest,
  TFavoriteIdsRpcRequest,
  TToggleFavoriteRpcRequest,
  TRemoveFavoriteRpcRequest,
  TMyFavoritesResponse,
  TMyFavoriteIdsResponse,
  TToggleFavoriteResponse,
} from "@common/types";

import { Injectable } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/sequelize";
import { QueryTypes, Sequelize, UniqueConstraintError } from "sequelize";

import { toListParams, toPaginatedItemsResponse } from "@common/utils";

import { assertRpcPositiveInt } from "../../shared";
import {
  mapFavoriteToItemResponse,
  mapFavoritesToIdsResponse,
} from "../mappers";
import { UserFavorite } from "../models";

@Injectable()
export class FavoritesService {
  constructor(
    @InjectModel(UserFavorite)
    private readonly favoriteRepository: typeof UserFavorite,
    @InjectConnection()
    private readonly sequelize: Sequelize
  ) {}

  /**
   * Добавить или убрать фильм из избранного.
   * Сериализация через pg_advisory_xact_lock(userId, filmId) —
   * SELECT FOR UPDATE не лочит отсутствие строки (toggle race).
   */
  async toggle(
    request: TToggleFavoriteRpcRequest
  ): Promise<TToggleFavoriteResponse> {
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

      const existing = await this.favoriteRepository.findOne({
        where: { userId, filmId },
        transaction,
      });

      if (existing) {
        await existing.destroy({ transaction });
        return { isFavorite: false };
      }

      try {
        await this.favoriteRepository.create(
          { userId, filmId },
          { transaction }
        );
        return { isFavorite: true };
      } catch (error) {
        // Защита на случай обхода advisory (другой путь записи).
        if (error instanceof UniqueConstraintError) {
          return { isFavorite: true };
        }
        throw error;
      }
    });
  }

  /**
   * Только удаление (idempotent). Для orphan-favorite, когда фильма уже нет в kino.
   * Тот же advisory lock, что и toggle — иначе race remove↔toggle.
   */
  async remove(
    request: TRemoveFavoriteRpcRequest
  ): Promise<TToggleFavoriteResponse> {
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

      await this.favoriteRepository.destroy({
        where: { userId, filmId },
        transaction,
      });
      return { isFavorite: false };
    });
  }

  /** Пагинированный список избранного пользователя. */
  async list(request: TListFavoritesRpcRequest): Promise<TMyFavoritesResponse> {
    assertRpcPositiveInt(request.userId, "userId");

    const { userId } = request;
    const { page, perPage, offset } = toListParams(request);

    const { rows, count } = await this.favoriteRepository.findAndCountAll({
      where: { userId },
      order: [
        ["createdAt", "DESC"],
        ["id", "DESC"],
      ],
      limit: perPage,
      offset,
    });

    return toPaginatedItemsResponse(
      rows.map(mapFavoriteToItemResponse),
      count,
      page,
      perPage
    );
  }

  /** Все filmId избранного для hydrate панели. */
  async ids(request: TFavoriteIdsRpcRequest): Promise<TMyFavoriteIdsResponse> {
    assertRpcPositiveInt(request.userId, "userId");

    const favorites = await this.favoriteRepository.findAll({
      where: { userId: request.userId },
      attributes: ["filmId"],
    });

    return mapFavoritesToIdsResponse(favorites);
  }
}
