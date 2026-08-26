import { TFactEntity, TFilmEntity } from "@common/types/entity";

/** Атрибуты для Sequelize.create факта. */
export type TFactCreationAtt = Pick<TFactEntity, "value" | "type" | "spoiler" | "filmId">;

/** Sequelize-тип факта с опционально загруженной связью фильма. */
export type TFactOrmModel = TFactEntity & {
  film?: TFilmEntity;
};
