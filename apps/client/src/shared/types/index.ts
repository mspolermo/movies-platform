import { TGenreBased, TPersonBased, TCountryBased, TCommentBased, TFilmBased } from '@common/types';

// Основные типы данных
export interface User {
  id: number;
  email: string;
  name?: string;
  roles?: Role[];
}

export interface Role {
  id: number;
  name: string;
  value: string;
  createdAt: string;
  updatedAt: string;
}

// Используем общий тип Film из @common
export interface Film extends TFilmBased {
  genres?: TGenreBased[];
  countries?: TCountryBased[];
  persons?: TPersonBased[];
}



// Используем общий тип Comment из @common
export type Comment = TCommentBased;

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
  role: Role[];
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
