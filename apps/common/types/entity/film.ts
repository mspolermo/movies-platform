/** Доменная сущность фильма с полями, которые реально хранятся в таблице. */
export type TFilmEntity = {
  id: number;
  trailerName?: string;
  trailerUrl?: string;
  ratingKp?: number;
  votesKp?: number;
  ratingImdb?: number;
  votesImdb?: number;
  ratingFilmCritics?: number;
  votesFilmCritics?: number;
  ratingRussianFilmCritics?: number;
  votesRussianFilmCritics?: number;
  movieLength?: number;
  originalFilmLanguage?: string;
  filmNameRu: string;
  filmNameEn?: string;
  description?: string;
  premiereCountry?: string;
  slogan?: string;
  bigPictureUrl?: string;
  smallPictureUrl?: string;
  year?: number;
  top10?: number;
  top250?: number;
  premiereWorldDate?: Date;
};
