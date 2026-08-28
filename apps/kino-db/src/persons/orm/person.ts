// Общие типы для Person
import { TFilmEntity, TPersonEntity, TProfessionEntity } from "@common/types/entity";

/** Атрибуты для Sequelize.create персоны. */
export type TPersonCreationAtt = Pick<TPersonEntity, "nameRu" | "nameEn"> &
  Partial<Pick<TPersonEntity, "photoUrl">>;

/** Sequelize-тип персоны с опционально загруженными связями. */
export type TPersonOrmModel = TPersonEntity & {
  professions?: TProfessionEntity[]; // Связи Sequelize
  films?: TFilmEntity[]; // Связи Sequelize
};
