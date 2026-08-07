import type {
  TCommentResponse,
  TCommentsPaginatedResponse,
  TGetFilmCommentsRpcRequest,
  TToggleCommentLikeResponse,
} from "@common/types";

import { Injectable } from "@nestjs/common";

import { CommentDTO } from "@common/dto";

import { fromRpc } from "../../shared";
import { CommentsClient } from "../clients";

@Injectable()
export class CommentsService {
  constructor(private readonly commentsClient: CommentsClient) {}

  getCommentsByFilmId(
    request: TGetFilmCommentsRpcRequest
  ): Promise<TCommentsPaginatedResponse> {
    return fromRpc(this.commentsClient.getCommentsByFilmId(request));
  }

  createComment(
    filmId: number,
    dto: CommentDTO,
    userId: number,
    email: string
  ): Promise<TCommentResponse> {
    const authorName = this.resolveAuthorName(email);

    return fromRpc(
      this.commentsClient.createComment(filmId, dto, userId, authorName)
    );
  }

  toggleCommentLike(
    commentId: number,
    userId: number
  ): Promise<TToggleCommentLikeResponse> {
    return fromRpc(this.commentsClient.toggleCommentLike(commentId, userId));
  }

  /** authorName из local-part email (B33: заменить на user.name). */
  private resolveAuthorName(email: string): string {
    const [localPart] = email.split("@");

    return localPart?.trim() || email;
  }
}
