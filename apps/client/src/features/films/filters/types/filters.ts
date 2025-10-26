// Типы для фильтрации фильмов

export interface FilterItem {
  nameRu: string;
  nameEn: string;
}

export interface ActiveFilters {
  genres: string[];
  popularGenres: string[];
  popularCountries: string[];
  countries: string[];
  years: number | null | string;
  rating: number;
  grade: number;
  producer: string;
  actor: string;
}

export interface AllFilters {
  genres: FilterItem[];
  popularGenres: FilterItem[];
  popularCountries: FilterItem[];
  countries: FilterItem[];
  years: number[];
  rating: number;
  grade: number;
  producer: string;
  actor: string;
}

export type SortOption = 'popularity' | 'rating' | 'novelty' | 'alphabet';

export const DEFAULT_ACTIVE_FILTERS: ActiveFilters = {
  popularGenres: [],
  genres: [],
  popularCountries: [],
  countries: [],
  years: '',
  rating: 0,
  grade: 0,
  producer: '',
  actor: ''
};

export const DEFAULT_ALL_FILTERS: AllFilters = {
  popularGenres: [
    { nameRu: 'драма', nameEn: 'drama' },
    { nameRu: 'боевик', nameEn: 'action' },
    { nameRu: 'триллер', nameEn: 'thriller' },
    { nameRu: 'криминал', nameEn: 'crime' },
    { nameRu: 'комедия', nameEn: 'comedy' },
    { nameRu: 'фантастика', nameEn: 'fantastic' },
    { nameRu: 'приключения', nameEn: 'adventures' },
    { nameRu: 'семейный', nameEn: 'family' },
    { nameRu: 'аниме', nameEn: 'anime' },
    { nameRu: 'фэнтези', nameEn: 'fantasy' }
  ],
  genres: [],
  popularCountries: [
    { nameRu: 'Россия', nameEn: 'Russia' },
    { nameRu: 'США', nameEn: 'USA' },
    { nameRu: 'Германия', nameEn: 'Germany' },
    { nameRu: 'Великобритания', nameEn: 'Great Britain' },
    { nameRu: 'Япония', nameEn: 'Japan' },
    { nameRu: 'Китай', nameEn: 'China' },
    { nameRu: 'Корея Южная', nameEn: 'South Korea' },
    { nameRu: 'Индия', nameEn: 'India' },
    { nameRu: 'СССР', nameEn: 'SSSR' },
    { nameRu: 'Франция', nameEn: 'France' }
  ],
  countries: [],
  years: [],
  rating: 0,
  grade: 0,
  producer: '',
  actor: ''
};

export const SORT_OPTIONS: SortOption[] = ['popularity', 'rating', 'novelty', 'alphabet'];

