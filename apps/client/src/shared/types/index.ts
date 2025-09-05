import { TGenreBased, TPersonBased, TCountryBased, TFilmBased, TRoleBased } from '@common/types';

// Основные типы данных


// Используем общий тип Film из @common
export interface Film extends TFilmBased {
  genres?: TGenreBased[];
  countries?: TCountryBased[];
  persons?: TPersonBased[];
}

// API типы
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  email: string;
  userId: number;
  role: TRoleBased[];
  token: {
    token: string;
  };
}

export interface SearchParams {
  query?: string;
  page?: number;
  limit?: number;
  genre?: number;
  country?: number;
  year?: number;
}
