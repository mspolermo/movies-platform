import type { TCommentResponse, TCommentsTreeResponse } from "@common/types";

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";

import { CommentDTO } from "@common/dto";

import { Comment } from "./comments.model";

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment) private commentRepository: typeof Comment
  ) {}

  async createComment(userId: number, filmId: number, dto: CommentDTO): Promise<TCommentResponse> {
    const comment = await this.commentRepository.create({
      header: dto.header,
      value: dto.value,
      authorId: userId,
      nickName: dto.nickName,
      parentId: dto.parentId || null,
      filmId: filmId,
    });
    return comment;
  }

  async getAllCommentsByFilmId(id: number): Promise<TCommentsTreeResponse | null> {
    const comments = await this.commentRepository.findAll({
      where: {
        filmId: id,
      },
    });

    const sorting: TCommentsTreeResponse = [];

    for (let i = 0; i < comments.length; i++) {
      const childrenComments: TCommentResponse[] = [];

      if (comments[i].parentId === null) {
        for (let j = 0; j < comments.length; j++) {
          if (comments[j].parentId == comments[i].id) {
            childrenComments.push(comments[j]);
          }
        }

        sorting.push([comments[i], ...childrenComments]);
      }
    }

    if (sorting.length === 0) {
      return null;
    }
    return sorting;
  }
}
