import { TCommentEntity, TFilmEntity } from "../entity";

/** Атрибуты для Sequelize.create комментария. */
export type TCommentCreationAtt = Pick<TCommentEntity, "header" | "value" | "authorId" | "nickName" | "parentId" | "filmId">;

/** Sequelize-тип комментария с опционально загруженными связями. */
export type TCommentOrmModel = TCommentEntity & {
  film?: TFilmEntity; // Связи Sequelize
};
