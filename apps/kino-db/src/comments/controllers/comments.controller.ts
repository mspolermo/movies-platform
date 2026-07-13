import type {
  TCommentResponse,
  TCommentsPaginatedResponse,
  TToggleCommentLikeResponse,
} from "@common/types";

import { Controller } from "@nestjs/common";
import {
  MessagePattern,
  Payload,
} from "@nestjs/microservices";

import { CommentDTO } from "@common/dto";
import { kinoDbRpc } from "@common/services";

import { GetFilmCommentsDto } from "../dto";
import { CommentsService } from "../services";

@Controller("comments")
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService
  ) {}

  @MessagePattern(kinoDbRpc.comments.create)
  createComment(
    @Payload()
    data: {
      userId: number;
      filmId: number;
      authorName: string;
      dto: CommentDTO;
    }
  ): Promise<TCommentResponse> {
    const { userId, filmId, authorName, dto } = data;

    return this.commentsService.createComment(
      userId,
      filmId,
      authorName,
      dto
    );
  }

  @MessagePattern(kinoDbRpc.comments.getByFilmId)
  getCommentsByFilmId(
    @Payload() dto: GetFilmCommentsDto
  ): Promise<TCommentsPaginatedResponse> {
    return this.commentsService.getCommentsPaginatedByFilmId(
      dto
    );
  }

  @MessagePattern(kinoDbRpc.comments.toggleLike)
  toggleCommentLike(
    @Payload()
    data: {
      userId: number;
      commentId: number;
    }
  ): Promise<TToggleCommentLikeResponse> {
    const { userId, commentId } = data;

    return this.commentsService.toggleCommentLike(
      userId,
      commentId
    );
  }
}
