import type {
  TCommentResponse,
  TCommentsTreeResponse,
} from "@common/types";

import { Injectable } from "@nestjs/common";

import { CommentDTO } from "@common/dto";
import { kinoDbRpc, RmqService } from "@common/services";

@Injectable()
export class CommentsClient {
  constructor(private readonly rmq: RmqService) {}

  getCommentsByFilmId(
    filmId: number
  ): Promise<TCommentsTreeResponse> {
    return this.rmq.sendToFilms(
      kinoDbRpc.comments.getByFilmId,
      filmId
    );
  }

  createComment(
    filmId: number,
    dto: CommentDTO,
    userId: number
  ): Promise<TCommentResponse> {
    return this.rmq.sendToFilms(
      kinoDbRpc.comments.create,
      {
        filmId,
        dto,
        userId,
      }
    );
  }
}