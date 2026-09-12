import { TFilmEntity, TGenreEntity } from "@common/types/entity";

/** Атрибуты для Sequelize.create жанра. */
export type TGenreCreationAtt = Pick<TGenreEntity, "nameRu" | "nameEn">;

/** Sequelize-тип жанра с опционально загруженными связями. */
export type TGenreOrmModel = TGenreEntity & {
  films?: TFilmEntity[];
};
