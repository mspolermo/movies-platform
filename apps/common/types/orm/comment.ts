import { TCommentEntity, TFilmEntity } from "../entity";

// Тип для создания комментария
export interface TCommentCreationAtt extends Pick<TCommentEntity, "header" | "value" | "authorId" | "nickName" | "parentId" | "filmId"> {}

// Тип для Sequelize модели (расширяет базовый интерфейс)
export interface TCommentOrmModel extends TCommentEntity {
  film?: TFilmEntity; // Связи Sequelize
}
