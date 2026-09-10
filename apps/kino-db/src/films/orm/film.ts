import { TCommentEntity, TCountryEntity, TFactEntity, TFilmEntity, TGenreEntity, TPersonEntity } from "@common/types/entity";

/** Тип для создания фильма: обязательное имя + любые скаляры entity. */
export type TFilmCreationAtt = Pick<TFilmEntity, "filmNameRu"> &
  Partial<Omit<TFilmEntity, "id" | "filmNameRu">>;

/** ORM-поля фильма: nullable-поля соответствуют nullable-значениям в БД. */
type TFilmOrmFields = Pick<TFilmEntity, "id" | "filmNameRu"> & {
    [K in Exclude<keyof TFilmEntity, "id" | "filmNameRu">]:
      TFilmEntity[K] | null;
  };

/** Sequelize-тип фильма с опционально загруженными связями. */
export type TFilmOrmModel = TFilmOrmFields & {
  persons?: TPersonEntity[]; // Связи Sequelize
  countries?: TCountryEntity[]; // Связи Sequelize
  genres?: TGenreEntity[]; // Связи Sequelize
  facts?: TFactEntity[]; // Связи Sequelize
  comments?: TCommentEntity[]; // Связи Sequelize
};
