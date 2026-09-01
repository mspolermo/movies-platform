import { TPersonEntity, TProfessionEntity } from "@common/types/entity";

/** Атрибуты для Sequelize.create профессии. */
export type TProfessionCreationAtt = Pick<TProfessionEntity, "name">;

/** Sequelize-тип профессии с опционально загруженными связями. */
export type TProfessionOrmModel = TProfessionEntity & {
  persons?: TPersonEntity[]; // Связи Sequelize
};
