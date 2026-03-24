import { TFilmEntity, TGenreEntity } from "../entity";

// Тип для создания жанра
export interface TGenreCreationAtt extends Pick<TGenreEntity, "nameRu" | "nameEn"> {}

/** Sequelize-тип жанра с опционально загруженными связями. */
export interface TGenreOrmModel extends TGenreEntity {
  films?: TFilmEntity[];
}