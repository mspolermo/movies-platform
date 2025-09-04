// Общие типы для Person

import { TFilmBased } from "../film";
import { TProfessionBased } from "../profession";

export interface TPersonBased {
  id: number;
  photoUrl: string;
  nameRu: string;
  nameEn: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Тип для создания жанра Персоны
export interface TPersonCreationAtt extends Pick<TPersonBased, "nameRu" | "nameEn"> {}

// Тип для Sequelize модели (расширяет базовый интерфейс)
export interface TPersonModel extends TPersonBased {
  professions?: TProfessionBased[]; // Связи Sequelize
  films?: TFilmBased[]; // Связи Sequelize
}
