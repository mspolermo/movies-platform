// Общие типы для Fact

import { TFilmBased } from "../film";

/** Доменная сущность факта с полями, которые реально хранятся в таблице. */
export interface TFactEntity {
  id: number;
  value: string;
  type: string;
  spoiler: boolean;
  filmId: number;
}

/** Sequelize-тип факта с опционально загруженной связью фильма. */
export interface TFactModel extends TFactEntity {
  film?: TFilmBased;
}

