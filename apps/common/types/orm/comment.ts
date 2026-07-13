import { TCommentEntity, TFilmEntity } from "../entity";

/** Атрибуты для Sequelize.create комментария. */
export type TCommentCreationAtt = Pick<
  TCommentEntity,
  "title" | "text" | "authorId" | "authorName" | "filmId"
>;

/** Sequelize-тип комментария с опционально загруженными связями. */
export type TCommentOrmModel = TCommentEntity & {
  film?: TFilmEntity; // Связи Sequelize
};
