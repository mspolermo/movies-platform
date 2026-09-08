import type { TUserFavoriteEntity } from "@common/types/entity";

/** Атрибуты create избранного. */
export type TUserFavoriteCreationAtt = Pick<
  TUserFavoriteEntity,
  "userId" | "filmId"
>;

/** Sequelize-модель избранного. */
export type TUserFavoriteOrmModel = TUserFavoriteEntity;
