/** Доменная сущность лайка комментария. */
export type TCommentLikeEntity = {
  id: number;
  commentId: number;
  userId: number;
  createdAt: Date;
};
