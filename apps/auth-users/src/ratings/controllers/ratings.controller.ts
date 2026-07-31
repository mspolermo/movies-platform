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

import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

import { authUsersRpc } from "@common/services";

import { RatingsService } from "../services";

@Controller()
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @MessagePattern(authUsersRpc.ratings.upsert)
  upsert(
    @Payload() data: TUpsertFilmRatingRpcRequest
  ): Promise<TUpsertFilmRatingResponse> {
    return this.ratingsService.upsert(data);
  }

  @MessagePattern(authUsersRpc.ratings.delete)
  delete(
    @Payload() data: TDeleteFilmRatingRpcRequest
  ): Promise<TDeleteFilmRatingResponse> {
    return this.ratingsService.delete(data);
  }

  @MessagePattern(authUsersRpc.ratings.list)
  list(
    @Payload() data: TListFilmRatingsRpcRequest
  ): Promise<TMyFilmRatingsResponse> {
    return this.ratingsService.list(data);
  }

  @MessagePattern(authUsersRpc.ratings.grades)
  grades(
    @Payload() data: TFilmRatingGradesRpcRequest
  ): Promise<TMyFilmRatingGradesResponse> {
    return this.ratingsService.grades(data);
  }
}
