import { TCountryBased, TGenreBased, TPersonModel } from "@common/types";

export interface CardsBlockProps {
  persons?: TPersonModel[];
}

export interface DescriptionBlockProps {
  description: string;
  filmName: string;
}

export interface PosterPreviewBlockProps {
  posterUrl?: string;
  alt: string;
}

export interface ReitingBlockProps {
  ratingKp?: number;
  votesKp?: number;
  filmNameRu: string;
  filmNameEn?: string;
}

export interface SloganBlockProps {
  slogan?: string;
}

export interface SummaryBlockProps {
  filmName: string;
  year?: number;
  genres?: TGenreBased[];
  movieLength?: number;
  countries?: TCountryBased[];
}

export interface TrailerBlockProps {
  trailerUrl?: string;
  filmName: string;
}