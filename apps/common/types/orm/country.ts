import { TCountryEntity, TFilmEntity } from "../entity";

// Тип для создания страны
export interface TCountryCreationAtt extends Pick<TCountryEntity, "countryName" | "countryNameEn"> {}

/** Sequelize-тип страны с опционально загруженными связями. */
export interface TCountryOrmModel extends TCountryEntity {
  films?: TFilmEntity[];
}
