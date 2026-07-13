import type {
  TCommentResponse,
  TCommentsPaginatedResponse,
  TGetFilmCommentsRpcRequest,
  TToggleCommentLikeResponse,
} from "@common/types";

import { Injectable, NotFoundException } from "@nestjs/common";

import { CommentDTO } from "@common/dto";
import { RmqService, authUsersRpc } from "@common/services";

import { CommentsClient } from "../clients";

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsClient: CommentsClient,
    private readonly rmq: RmqService
  ) {}

  getCommentsByFilmId(
    request: TGetFilmCommentsRpcRequest
  ): Promise<TCommentsPaginatedResponse> {
    return this.commentsClient.getCommentsByFilmId(request);
  }

  async createComment(
    filmId: number,
    dto: CommentDTO,
    userId: number
  ): Promise<TCommentResponse> {
    const user = await this.rmq.sendToUsers(authUsersRpc.users.getById, userId);

    if (!user?.email) {
      throw new NotFoundException("Пользователь не найден");
    }

    const authorName = this.resolveAuthorName(user.email);

    return this.commentsClient.createComment(filmId, dto, userId, authorName);
  }

  toggleCommentLike(
    commentId: number,
    userId: number
  ): Promise<TToggleCommentLikeResponse> {
    return this.commentsClient.toggleCommentLike(commentId, userId);
  }

  private resolveAuthorName(email: string): string {
    const [localPart] = email.split("@");

    return localPart?.trim() || email;
  }
}
