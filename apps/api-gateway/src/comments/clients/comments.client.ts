import type {
  TCommentResponse,
  TCommentsPaginatedResponse,
  TGetFilmCommentsRpcRequest,
  TToggleCommentLikeResponse,
} from "@common/types";

import { Injectable } from "@nestjs/common";

import { CommentDTO } from "@common/dto";
import { kinoDbRpc, RmqService } from "@common/services";

@Injectable()
export class CommentsClient {
  constructor(private readonly rmq: RmqService) {}

  getCommentsByFilmId(
    request: TGetFilmCommentsRpcRequest
  ): Promise<TCommentsPaginatedResponse> {
    return this.rmq.sendToFilms(
      kinoDbRpc.comments.getByFilmId,
      request
    );
  }

  createComment(
    filmId: number,
    dto: CommentDTO,
    userId: number,
    authorName: string
  ): Promise<TCommentResponse> {
    return this.rmq.sendToFilms(
      kinoDbRpc.comments.create,
      {
        filmId,
        dto,
        userId,
        authorName,
      }
    );
  }

  toggleCommentLike(
    commentId: number,
    userId: number
  ): Promise<TToggleCommentLikeResponse> {
    return this.rmq.sendToFilms(
      kinoDbRpc.comments.toggleLike,
      {
        commentId,
        userId,
      }
    );
  }
}
