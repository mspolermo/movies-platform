import type { Comment } from "../models/comments.model";
import type { TCommentResponse } from "@common/types";

type TCommentResponseMeta = {
  likesCount?: number;
  liked?: boolean;
};

/**
 * Преобразует ORM-модель комментария в DTO ответа.
 */
export function mapCommentToResponse(
  comment: Comment,
  meta: TCommentResponseMeta = {}
): TCommentResponse {
  const json = comment.toJSON();

  const response: TCommentResponse = {
    id: json.id,
    title: json.title,
    text: json.text,
    authorId: json.authorId,
    authorName: json.authorName,
    filmId: json.filmId,
    createdAt:
      json.createdAt instanceof Date
        ? json.createdAt.toISOString()
        : String(json.createdAt),
    likesCount: meta.likesCount ?? 0,
  };

  if (meta.liked !== undefined) {
    response.liked = meta.liked;
  }

  return response;
}

/**
 * Преобразует список ORM-моделей в плоский список ответов API.
 */
export function mapCommentsToResponseList(
  comments: Comment[],
  likesCountByCommentId: Map<number, number>,
  likedCommentIds?: Set<number>
): TCommentResponse[] {
  return comments.map((comment) => {
    const meta: TCommentResponseMeta = {
      likesCount: likesCountByCommentId.get(comment.id) ?? 0,
    };

    if (likedCommentIds) {
      meta.liked = likedCommentIds.has(comment.id);
    }

    return mapCommentToResponse(comment, meta);
  });
}
