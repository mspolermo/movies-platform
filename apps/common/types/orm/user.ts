import type { TRoleEntity, TUserEntity } from "../entity";

// Тип для создания пользователя
export type TUserCreationAtt = Pick<TUserEntity, "email" | "password" | "name">;

// Тип для Sequelize модели (расширяет базовый интерфейс)
export interface TUserOrmModel extends TUserEntity {
  roles?: TRoleEntity[]; // Связи Sequelize с ролями
}