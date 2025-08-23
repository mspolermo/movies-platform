export interface FilmFilters {
  page: number;
  perPage: number;
  genres?: string[];
  countries?: string[];
  persons?: string[];
  minRatingKp?: number;
  minVotesKp?: number;
  sortBy?: string;
  year?: number;
}
