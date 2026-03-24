import { TRoleEntity, TUserEntity } from "../entity";

/** Атрибуты для Sequelize.create роли. */
export type TRoleCreationAtt = Pick<TRoleEntity, "value"> & {
  description?: string;
};

/** Sequelize-тип роли с опционально загруженными связями. */
export type TRoleOrmModel = TRoleEntity & {
  users?: TUserEntity[]; // Связи Sequelize с пользователями
};
