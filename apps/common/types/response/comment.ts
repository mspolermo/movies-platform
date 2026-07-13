import type { TCommentEntity } from "../entity";
import type { TPaginationMeta } from "../shared";

/** Ответ API для одного комментария. */
export type TCommentResponse = Pick<
  TCommentEntity,
  "id" | "title" | "text" | "authorId" | "authorName" | "filmId"
> & {
  createdAt: string;
  likesCount: number;
  /** Присутствует только для авторизованного пользователя. */
  liked?: boolean;
};

/** Пагинированный список отзывов к фильму. */
export type TCommentsPaginatedResponse = {
  items: TCommentResponse[];
} & TPaginationMeta;

/** Ответ toggle-лайка комментария. */
export type TToggleCommentLikeResponse = {
  liked: boolean;
  likesCount: number;
};
