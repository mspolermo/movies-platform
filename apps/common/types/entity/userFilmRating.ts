/** Оценка фильма пользователем 1–10 (auth-users). */
export type TUserFilmRatingEntity = {
  id: number;
  userId: number;
  filmId: number;
  grade: number;
  createdAt: Date;
  updatedAt: Date;
};
