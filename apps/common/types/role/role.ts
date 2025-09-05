// Общие типы для Role

import { TUserBased } from "../user";

export interface TRoleBased {
  id: number;
  value: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Тип для создания роли
export interface TRoleCreationAtt extends Pick<TRoleBased, "value"> {
  description?: string;
}

// Тип для Sequelize модели (расширяет базовый интерфейс)
export interface TRoleModel extends TRoleBased {
  users?: TUserBased[]; // Связи Sequelize с пользователями
}
