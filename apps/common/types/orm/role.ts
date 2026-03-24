import { TRoleEntity, TUserEntity } from "../entity";

// Тип для создания роли
export interface TRoleCreationAtt extends Pick<TRoleEntity, "value"> {
  description?: string;
}

// Тип для Sequelize модели (расширяет базовый интерфейс)
export interface TRoleOrmModel extends TRoleEntity {
  users?: TUserEntity[]; // Связи Sequelize с пользователями
}