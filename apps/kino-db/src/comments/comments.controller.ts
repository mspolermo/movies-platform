import type { TCommentResponse, TCommentsTreeResponse } from "@common/types";

import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

import { CommentDTO } from "@common/dto";
import { kinoDbRpc } from "@common/services";

import { CommentsService } from "./comments.service";

@Controller("comments")
export class CommentsController {
  constructor(private commentService: CommentsService) {}

  @MessagePattern(kinoDbRpc.comments.create)
  async createComment(
    @Payload() data: { userId: number; filmId: number; dto: CommentDTO }
  ): Promise<TCommentResponse> {
    const { userId, filmId, dto } = data;
    return await this.commentService.createComment(userId, filmId, dto);
  }

  @MessagePattern(kinoDbRpc.comments.getByFilmId)
  async getCommentsByFilmId(@Payload() id: number): Promise<TCommentsTreeResponse | null> {
    return await this.commentService.getAllCommentsByFilmId(id);
  }
}
