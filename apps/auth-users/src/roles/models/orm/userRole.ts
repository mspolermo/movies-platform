import type { TUserRoleEntity } from "@common/types/entity";

/** Атрибуты для Sequelize.create связи пользователя с ролью. */
export type TUserRoleCreationAtt = Pick<
  TUserRoleEntity,
  "roleId" | "userId"
>;

/** Sequelize-тип связи пользователя с ролью. */
export type TUserRoleOrmModel = TUserRoleEntity;