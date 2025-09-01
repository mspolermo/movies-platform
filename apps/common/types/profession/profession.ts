// Общие типы для Profession

import { TPersonBased } from "../person";

export interface TProfessionBased {
  id: number;
  name: string;
}

// Тип для создания профессии
export interface TProfessionCreationAtt extends Pick<TProfessionBased, "name"> {}

// Тип для Sequelize модели (расширяет базовый интерфейс)
export interface TProfessionModel extends TProfessionBased {
  persons?: TPersonBased[]; // Связи Sequelize
}
