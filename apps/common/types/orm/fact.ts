import { TFactEntity, TFilmEntity } from "../entity";

// Тип для создания факта
export interface TFactCreationAtt extends Pick<TFactEntity, "value" | "type" | "spoiler" | "filmId"> {}

/** Sequelize-тип факта с опционально загруженной связью фильма. */
export interface TFactOrmModel extends TFactEntity {
  film?: TFilmEntity;
}
