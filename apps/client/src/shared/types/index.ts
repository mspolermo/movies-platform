import { TGenreBased, TPersonBased, TCountryBased } from '@common/types';

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

export interface Film {
  id: number;
  filmNameRu: string;
  filmNameEn: string;
  year?: number;
  ratingKp?: number;
  votesKp?: number;
  description?: string;
  posterUrl?: string;
  trailerUrl?: string;
  duration?: number;
  createdAt?: Date;
  updatedAt?: Date;
  genres?: TGenreBased[];
  countries?: TCountryBased[];
  persons?: TPersonBased[];
}



export interface Comment {
  id: number;
  text: string;
  userId: number;
  filmId: number;
  createdAt: string;
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
