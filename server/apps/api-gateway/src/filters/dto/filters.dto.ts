import { CountryDto } from './country.dto';
import { GenreDto } from './genre.dto';

export interface FiltersResult {
  genres: GenreDto[];
  countries: CountryDto[];
  years: number[];
}
