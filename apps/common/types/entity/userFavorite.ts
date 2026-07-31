/** Избранный фильм пользователя (auth-users). */
export type TUserFavoriteEntity = {
  id: number;
  userId: number;
  filmId: number;
  createdAt: Date;
};
