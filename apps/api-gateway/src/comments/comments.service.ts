import type { TCommentResponse, TCommentsTreeResponse } from "@common/types";

import { Injectable } from "@nestjs/common";

import { CommentDTO } from "@common/dto";
import { RmqService, kinoDbRpc } from "@common/services";

@Injectable()
export class CommentsService {
  constructor(private readonly rmq: RmqService) {}

  async getCommentsByFilmId(
    filmId: number
  ): Promise<TCommentsTreeResponse> {
    return this.rmq.sendToFilms<TCommentsTreeResponse>(
      kinoDbRpc.comments.getByFilmId,
      filmId
    );
  }

  async createComment(
    filmId: number,
    dto: CommentDTO,
    userId: number
  ): Promise<TCommentResponse> {
    return this.rmq.sendToFilms<TCommentResponse>(
      kinoDbRpc.comments.create,
      { filmId, dto, userId }
    );
  }
}