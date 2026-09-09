import type { TUserFilmRatingEntity } from "@common/types/entity";

/** Атрибуты create оценки фильма. */
export type TUserFilmRatingCreationAtt = Pick<
  TUserFilmRatingEntity,
  "userId" | "filmId" | "grade"
>;

/** Sequelize-модель оценки фильма. */
export type TUserFilmRatingOrmModel = TUserFilmRatingEntity;
