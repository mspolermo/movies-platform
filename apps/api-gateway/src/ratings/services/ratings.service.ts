import type {
  TUpsertFilmRatingResponse,
  TDeleteFilmRatingResponse,
  TMyFilmRatingsResponse,
  TMyFilmRatingGradesResponse,
  TListPaginationParams,
} from "@common/types";

import { Injectable, NotFoundException } from "@nestjs/common";

import { FilmsService } from "../../films/services";
import { fromRpc } from "../../shared";
import { RatingsClient } from "../clients";

/** HTTP-оркестрация оценок: validate film на write → auth-users. */
@Injectable()
export class RatingsService {
  constructor(
    private readonly ratingsClient: RatingsClient,
    private readonly filmsService: FilmsService
  ) {}

  /**
   * Upsert оценки.
   * Фильм есть → ratings.upsert; фильма нет (404) → orphan cleanup (delete) + 404.
   */
  async upsert(
    userId: number,
    filmId: number,
    grade: number
  ): Promise<TUpsertFilmRatingResponse> {
    try {
      await this.filmsService.getFilmById(filmId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        // Best-effort orphan cleanup — сбой delete не должен маскировать 404 фильма.
        try {
          await fromRpc(this.ratingsClient.delete(userId, filmId));
        } catch {
          /* ignore */
        }
        throw error;
      }
      throw error;
    }

    return fromRpc(this.ratingsClient.upsert(userId, filmId, grade));
  }

  delete(
    userId: number,
    filmId: number
  ): Promise<TDeleteFilmRatingResponse> {
    return fromRpc(this.ratingsClient.delete(userId, filmId));
  }

  list(
    userId: number,
    params: TListPaginationParams
  ): Promise<TMyFilmRatingsResponse> {
    return fromRpc(this.ratingsClient.list(userId, params));
  }

  grades(userId: number): Promise<TMyFilmRatingGradesResponse> {
    return fromRpc(this.ratingsClient.grades(userId));
  }
}
