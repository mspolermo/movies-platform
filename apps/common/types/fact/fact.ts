// Общие типы для Fact

import { TFilmBased } from "../film";

export interface TFactBased {
  id: number;
  value: string;
  type: string;
  spoiler: boolean;
  filmId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Тип для создания факта
export interface TFactCreationAtt extends Pick<TFactBased, "value" | "type" | "spoiler" | "filmId"> {}

// Тип для Sequelize модели (расширяет базовый интерфейс)
export interface TFactModel extends TFactBased {
  film?: TFilmBased; // Связи Sequelize
}

