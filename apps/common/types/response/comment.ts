import type { TCommentEntity } from "../entity";

/** Ответ API для одного комментария. */
export type TCommentResponse = Pick<
  TCommentEntity,
  "id" | "header" | "value" | "authorId" | "nickName" | "parentId" | "filmId"
>;

/** Ответ API для дерева комментариев фильма. */
export type TCommentsTreeResponse = TCommentResponse[][];
