/** Доменная сущность связи пользователя с ролью. */
export type TUserRoleEntity = {
  id: number;
  roleId?: number;
  userId?: number;
};