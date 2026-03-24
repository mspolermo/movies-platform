import { TCommentEntity, TCountryEntity, TFactEntity, TFilmEntity, TGenreEntity, TPersonEntity } from "../entity";

/** Тип для создания фильма */
export type TFilmCreationAtt = Pick<TFilmEntity, "filmNameRu">;

/** Sequelize-тип фильма с опционально загруженными связями. */
export type TFilmOrmModel = TFilmEntity & {
  persons?: TPersonEntity[]; // Связи Sequelize
  countries?: TCountryEntity[]; // Связи Sequelize
  genres?: TGenreEntity[]; // Связи Sequelize
  facts?: TFactEntity[]; // Связи Sequelize
  comments?: TCommentEntity[]; // Связи Sequelize
};
