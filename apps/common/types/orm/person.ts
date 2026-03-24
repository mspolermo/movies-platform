// Общие типы для Person
import { TFilmEntity, TPersonEntity, TProfessionEntity } from "../entity";

/** Атрибуты для Sequelize.create персоны. */
export type TPersonCreationAtt = Pick<TPersonEntity, "nameRu" | "nameEn">;

/** Sequelize-тип персоны с опционально загруженными связями. */
export type TPersonOrmModel = TPersonEntity & {
  professions?: TProfessionEntity[]; // Связи Sequelize
  films?: TFilmEntity[]; // Связи Sequelize
};
