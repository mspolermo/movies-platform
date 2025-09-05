// Общие типы для User

import { TRoleBased } from "../role";

export interface TUserBased {
  id: number;
  email: string;
  password?: string;
  name?: string;
  roles?: TRoleBased[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Тип для создания пользователя
export interface TUserCreationAtt extends Pick<TUserBased, "email" | "password"> {
  name?: string;
}

// Тип для результата пользователя (без пароля)
export interface TUserResult extends Omit<TUserBased, "password"> {}

// Тип для Sequelize модели (расширяет базовый интерфейс)
export interface TUserModel extends TUserBased {
  roles?: TRoleBased[]; // Связи Sequelize с ролями
}
