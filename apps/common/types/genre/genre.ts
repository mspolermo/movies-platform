import { TFilmBased } from "../film";

/** Доменная сущность жанра с полями, которые реально хранятся в таблице. */
export interface TGenreEntity {
  id: number;
  nameRu: string;
  nameEn: string;
}

/** Sequelize-тип жанра с опционально загруженными связями. */
export interface TGenreModel extends TGenreEntity {
  films?: TFilmBased[];
}