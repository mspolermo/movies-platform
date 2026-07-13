import type { TCommentLikeEntity } from "../entity";

/** Атрибуты для Sequelize.create лайка комментария. */
export type TCommentLikeCreationAtt = Pick<
  TCommentLikeEntity,
  "commentId" | "userId"
>;

/** Sequelize-тип лайка комментария. */
export type TCommentLikeOrmModel = TCommentLikeEntity;
