import type {
  TCommentResponse,
  TCommentsTreeResponse,
} from "@common/types";

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";

import { CommentDTO } from "@common/dto";

import {
  mapCommentToResponse,
  mapCommentsToTree,
} from "../mappers";
import { Comment } from "../models/comments.model";

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment)
    private readonly commentRepository: typeof Comment
  ) {}

  async createComment(
    userId: number,
    filmId: number,
    dto: CommentDTO
  ): Promise<TCommentResponse> {
    const comment =
      await this.commentRepository.create({
        header: dto.header,
        value: dto.value,
        authorId: userId,
        nickName: dto.nickName,
        parentId: dto.parentId ?? null,
        filmId,
      });

    return mapCommentToResponse(comment);
  }

  async getCommentsTreeByFilmId(
    filmId: number
  ): Promise<TCommentsTreeResponse> {
    const comments =
      await this.commentRepository.findAll({
        where: {
          filmId,
        },
        order: [["createdAt", "ASC"]],
      });

    return mapCommentsToTree(comments);
  }
}