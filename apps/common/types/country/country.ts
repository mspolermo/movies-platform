import { TFilmBased } from "../film";

/** Доменная сущность страны с полями, которые реально хранятся в таблице. */
export interface TCountryEntity {
  id: number;
  countryName: string;
  countryNameEn: string;
}

/** Sequelize-тип страны с опционально загруженными связями. */
export interface TCountryModel extends TCountryEntity {
  films?: TFilmBased[];
}
