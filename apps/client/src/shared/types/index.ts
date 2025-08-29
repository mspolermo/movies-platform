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
  name: string;
  description?: string;
  year?: number;
  rating?: number;
  genres?: Genre[];
  countries?: Country[];
  persons?: Person[];
}

export interface Genre {
  id: number;
  nameRu: string;
  nameEn: string;
}

export interface Country {
  id: number;
  name: string;
}

export interface Person {
  id: number;
  name: string;
  profession?: string;
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
