// Общие типы для Comment

import { TFilmBased } from "../film";

export interface TCommentBased {
  id: number;
  header: string;
  value: string;
  authorId: number;
  nickName: string;
  parentId: number;
  filmId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Тип для создания комментария
export interface TCommentCreationAtt extends Pick<TCommentBased, "header" | "value" | "authorId" | "nickName" | "parentId" | "filmId"> {}

// Тип для Sequelize модели (расширяет базовый интерфейс)
export interface TCommentModel extends TCommentBased {
  film?: TFilmBased; // Связи Sequelize
}
