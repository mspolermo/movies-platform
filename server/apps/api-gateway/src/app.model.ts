// Интерфейсы пользователей и аутентификации
export interface User {
  id: number;
  email: string;
  roles: Role[];
}

export interface Role {
  id: number;
  value: string;
}

// Интерфейсы структур данных
export interface Genre {
  id: number;
  nameRu: string;
  nameEn: string;
}

export interface Country {
  countryName: string;
  countryNameEn: string;
}

export interface Film {
  id: number;
  filmNameRu: string;
  filmNameEn: string;
}

export interface Person {
  id: number;
  nameRu: string;
  nameEn: string;
}

export interface Comment {
  id: number;
  text: string;
  userId: number;
  filmId: number;
}

// Интерфейсы фильтров и поиска
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

export interface SearchResult {
  films: Array<{
    id: number;
    nameRu: string;
    nameEn: string;
  }>;
  people: Array<{
    id: number;
    nameRu: string;
    nameEn: string;
  }>;
  genres: Array<{
    nameRu: string;
    nameEn: string;
  }>;
}

export interface FiltersResult {
  genres: Array<{
    nameRu: string;
    nameEn: string;
  }>;
  countries: Array<{
    countryName: string;
    countryNameEn: string;
  }>;
  years: number[];
}

// Интерфейсы ответов
export interface AuthResponse {
  email: string;
  userId: number;
  role: Role[];
  token: string;
}

export interface RegistrationResponse {
  User: User;
  role: Role[];
  token: string;
}

// Интерфейсы результатов трансформации
export interface GenreDto {
  nameRu: string;
  nameEn: string;
}

export interface CountryDto {
  countryName: string;
  countryNameEn: string;
}

export interface FilmDto {
  id: number;
  nameRu: string;
  nameEn: string;
}

export interface PersonDto {
  id: number;
  nameRu: string;
  nameEn: string;
}

export interface GenreListDto {
  id: number;
  nameRu: string;
  nameEn: string;
}
