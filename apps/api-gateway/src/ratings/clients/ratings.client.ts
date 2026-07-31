import type {
  TUpsertFilmRatingResponse,
  TDeleteFilmRatingResponse,
  TMyFilmRatingsResponse,
  TMyFilmRatingGradesResponse,
  TListPaginationParams,
} from "@common/types";

import { Injectable } from "@nestjs/common";

import { authUsersRpc, RmqService } from "@common/services";

/** RMQ-клиент оценок фильмов (auth-users). */
@Injectable()
export class RatingsClient {
  constructor(private readonly rmq: RmqService) {}

  upsert(
    userId: number,
    filmId: number,
    grade: number
  ): Promise<TUpsertFilmRatingResponse> {
    return this.rmq.sendToUsers(authUsersRpc.ratings.upsert, {
      userId,
      filmId,
      grade,
    });
  }

  delete(userId: number, filmId: number): Promise<TDeleteFilmRatingResponse> {
    return this.rmq.sendToUsers(authUsersRpc.ratings.delete, {
      userId,
      filmId,
    });
  }

  list(
    userId: number,
    params: TListPaginationParams
  ): Promise<TMyFilmRatingsResponse> {
    return this.rmq.sendToUsers(authUsersRpc.ratings.list, {
      userId,
      ...params,
    });
  }

  grades(userId: number): Promise<TMyFilmRatingGradesResponse> {
    return this.rmq.sendToUsers(authUsersRpc.ratings.grades, { userId });
  }
}
