// Общие типы для Film

import { TCommentBased } from "../comment";
import { TCountryBased } from "../country";
import { TFactBased } from "../fact";
import { TGenreBased } from "../genre";
import { TPersonBased } from "../person";
import { TProfessionWithPersons } from "../profession";

export interface TFilmBased {
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
  createdAt?: Date;
  updatedAt?: Date;
}

// Тип для создания фильма
export interface TFilmCreationAtt extends Pick<TFilmBased, "filmNameRu"> {}

// Тип для Sequelize модели (расширяет базовый интерфейс)
export interface TFilmModel extends TFilmBased {
  persons?: TPersonBased[]; // Связи Sequelize
  countries?: TCountryBased[]; // Связи Sequelize
  genres?: TGenreBased[]; // Связи Sequelize
  fact?: TFactBased; // Связи Sequelize
  comments?: TCommentBased[]; // Связи Sequelize
}

export interface TFilmWithProfessions extends Omit<TFilmModel, 'persons'> {
  professions?: TProfessionWithPersons[]; // Профессии с персонами
}