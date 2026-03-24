import type { TRoleEntity, TUserEntity } from "../entity";

/** Атрибуты для Sequelize.create пользователя. */
export type TUserCreationAtt = Pick<TUserEntity, "email" | "password" | "name">;

/** Sequelize-тип пользователя с опционально загруженными связями. */
export type TUserOrmModel = TUserEntity & {
  roles?: TRoleEntity[]; // Связи Sequelize с ролями
};
