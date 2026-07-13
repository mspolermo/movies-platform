import type {
  TCommentResponse,
  TCommentsPaginatedResponse,
  TToggleCommentLikeResponse,
} from "@common/types";

import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/sequelize";
import { Op, Sequelize, Transaction } from "sequelize";

import { LIST_DEFAULT_LIMIT, LIST_MAX_LIMIT } from "@common/constants";
import { CommentDTO } from "@common/dto";

import { GetFilmCommentsDto } from "../dto";
import {
  mapCommentToResponse,
  mapCommentsToResponseList,
} from "../mappers";
import { CommentLike } from "../models/commentLike.model";
import { Comment } from "../models/comments.model";

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment)
    private readonly commentRepository: typeof Comment,
    @InjectModel(CommentLike)
    private readonly commentLikeRepository: typeof CommentLike,
    @InjectConnection()
    private readonly sequelize: Sequelize
  ) {}

  async createComment(
    userId: number,
    filmId: number,
    authorName: string,
    dto: CommentDTO
  ): Promise<TCommentResponse> {
    const comment = await this.commentRepository.create({
      title: dto.title,
      text: dto.text,
      authorId: userId,
      authorName,
      filmId,
    });

    return mapCommentToResponse(comment, { likesCount: 0, liked: false });
  }

  async getCommentsPaginatedByFilmId(
    dto: GetFilmCommentsDto
  ): Promise<TCommentsPaginatedResponse> {
    const page = dto.page ?? 1;
    const perPage = Math.min(
      dto.perPage ?? LIST_DEFAULT_LIMIT,
      LIST_MAX_LIMIT
    );
    const offset = (page - 1) * perPage;

    const { count, rows } = await this.commentRepository.findAndCountAll({
      where: {
        filmId: dto.filmId,
      },
      order: [["createdAt", "DESC"]],
      limit: perPage,
      offset,
    });

    const total = Array.isArray(count) ? count.length : count;
    const commentIds = rows.map((comment) => comment.id);
    const likesCountMap = await this.getLikesCountMap(commentIds);
    const likedCommentIds =
      dto.userId != null
        ? await this.getLikedCommentIds(dto.userId, commentIds)
        : undefined;

    return {
      items: mapCommentsToResponseList(rows, likesCountMap, likedCommentIds),
      total,
      page,
      perPage,
      hasMore: page * perPage < total,
    };
  }

  async toggleCommentLike(
    userId: number,
    commentId: number
  ): Promise<TToggleCommentLikeResponse> {
    return this.sequelize.transaction(async (transaction) => {
      const comment = await this.commentRepository.findByPk(commentId, {
        transaction,
        lock: Transaction.LOCK.UPDATE,
      });

      if (!comment) {
        throw new NotFoundException("Комментарий не найден");
      }

      const existing = await this.commentLikeRepository.findOne({
        where: {
          commentId,
          userId,
        },
        transaction,
      });

      let liked: boolean;

      if (existing) {
        await existing.destroy({ transaction });
        liked = false;
      } else {
        await this.commentLikeRepository.create(
          {
            commentId,
            userId,
          },
          { transaction }
        );
        liked = true;
      }

      const likesCount = await this.commentLikeRepository.count({
        where: { commentId },
        transaction,
      });

      return {
        liked,
        likesCount,
      };
    });
  }

  private async getLikesCountMap(
    commentIds: number[]
  ): Promise<Map<number, number>> {
    const map = new Map<number, number>();

    if (commentIds.length === 0) {
      return map;
    }

    const likes = await this.commentLikeRepository.findAll({
      attributes: ["commentId"],
      where: {
        commentId: {
          [Op.in]: commentIds,
        },
      },
      raw: true,
    });

    for (const like of likes) {
      map.set(like.commentId, (map.get(like.commentId) ?? 0) + 1);
    }

    return map;
  }

  private async getLikedCommentIds(
    userId: number,
    commentIds: number[]
  ): Promise<Set<number>> {
    if (commentIds.length === 0) {
      return new Set();
    }

    const likes = await this.commentLikeRepository.findAll({
      attributes: ["commentId"],
      where: {
        userId,
        commentId: {
          [Op.in]: commentIds,
        },
      },
      raw: true,
    });

    return new Set(likes.map((like) => like.commentId));
  }
}
