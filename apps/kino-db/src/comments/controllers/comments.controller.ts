import type {
  TCommentResponse,
  TCommentsTreeResponse,
} from "@common/types";

import { Controller } from "@nestjs/common";
import {
  MessagePattern,
  Payload,
} from "@nestjs/microservices";

import { CommentDTO } from "@common/dto";
import { kinoDbRpc } from "@common/services";

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
      dto: CommentDTO;
    }
  ): Promise<TCommentResponse> {
    const { userId, filmId, dto } = data;

    return this.commentsService.createComment(
      userId,
      filmId,
      dto
    );
  }

  @MessagePattern(kinoDbRpc.comments.getByFilmId)
  getCommentsByFilmId(
    @Payload() filmId: number
  ): Promise<TCommentsTreeResponse> {
    return this.commentsService.getCommentsTreeByFilmId(
      filmId
    );
  }
}