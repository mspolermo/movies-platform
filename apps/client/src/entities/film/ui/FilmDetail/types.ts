import { TCountryBased, TGenreBased, TPersonModel, TFilmBased, TFactBased } from "@common/types";

export interface CardsBlockProps {
  persons?: TPersonModel[];
}

export interface DescriptionBlockProps extends Pick<TFilmBased, 'description' | 'filmNameRu' | 'filmNameEn'> {}

export interface PosterPreviewBlockProps extends Pick<TFilmBased, 'bigPictureUrl' | 'smallPictureUrl' | 'filmNameRu' | 'filmNameEn'> {}

export interface RatingBlockProps extends Pick<TFilmBased, 'ratingKp' | 'votesKp' | 'filmNameRu' | 'filmNameEn'> {}

export interface SloganBlockProps extends Pick<TFilmBased, 'slogan'> {}

export interface SummaryBlockProps extends Pick<TFilmBased, 'filmNameRu' | 'filmNameEn' | 'year' | 'movieLength'> {
  genres?: TGenreBased[];
  countries?: TCountryBased[];
  isCartoon: boolean;
}

export interface TrailerBlockProps extends Pick<TFilmBased, 'trailerUrl' | 'filmNameRu' | 'filmNameEn'> {}

export interface FactBlockProps {
  fact?: TFactBased;
  isCartoon: boolean;
}
