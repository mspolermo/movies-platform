import { TCountryEntity, TFilmEntity } from "@common/types/entity";

/** Атрибуты для Sequelize.create страны. */
export type TCountryCreationAtt = Pick<TCountryEntity, "countryName" | "countryNameEn">;

/** Sequelize-тип страны с опционально загруженными связями. */
export type TCountryOrmModel = TCountryEntity & {
  films?: TFilmEntity[];
};
