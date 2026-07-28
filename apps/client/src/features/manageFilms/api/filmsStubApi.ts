import type { TAdminFilmItemResponse, TCreateFilmRequest, TUpdateFilmRequest } from '@common/types';

import { API_ENDPOINTS } from '@/shared/api';
import { debugStubLog } from '@/shared/lib';

/** Начальные данные в памяти (ADR-005); без HTTP. */
const INITIAL_FILMS: TAdminFilmItemResponse[] = [
  {
    id: 1,
    filmNameRu: 'Матрица',
    filmNameEn: 'The Matrix',
    year: 1999,
    movieLength: 136,
    description: 'Хакер Нео узнаёт правду о реальности.',
    smallPictureUrl: '',
    bigPictureUrl: '',
  },
  {
    id: 2,
    filmNameRu: 'Начало',
    filmNameEn: 'Inception',
    year: 2010,
    movieLength: 148,
    description: 'Вор идей проникает в сны.',
  },
];

let films = [...INITIAL_FILMS];
let nextId = 3;
const listeners = new Set<() => void>();

const emit = () => {
  listeners.forEach((listener) => listener());
};

/** Сброс хранилища-заглушки (тесты). */
export const resetFilmsStub = () => {
  films = INITIAL_FILMS.map((f) => ({ ...f }));
  nextId = 3;
  emit();
};

/** Подписка на изменения списка фильмов (заглушка). */
export const subscribeFilms = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

/** Текущий снимок списка фильмов. */
export const getFilmsSnapshot = (): TAdminFilmItemResponse[] => films;

/** Заглушка GET `/admin/films` (опциональный ?q=, фильтр на клиенте). */
export const listFilmsStub = async (q?: string): Promise<TAdminFilmItemResponse[]> => {
  debugStubLog('[manageFilms] LIST', { path: API_ENDPOINTS.ADMIN.FILMS.LIST, q });
  const normalized = q?.trim().toLowerCase();
  if (!normalized) return films;
  return films.filter(
    (f) =>
      f.filmNameRu.toLowerCase().includes(normalized) ||
      (f.filmNameEn?.toLowerCase().includes(normalized) ?? false)
  );
};

/** Заглушка GET `/admin/films/:id`. */
export const getFilmByIdStub = async (id: number): Promise<TAdminFilmItemResponse | null> => {
  debugStubLog('[manageFilms] GET', { path: API_ENDPOINTS.ADMIN.FILMS.BY_ID(id) });
  return films.find((f) => f.id === id) ?? null;
};

/** Заглушка POST `/admin/films`. */
export const createFilmStub = async (
  payload: TCreateFilmRequest
): Promise<TAdminFilmItemResponse> => {
  debugStubLog('[manageFilms] CREATE', { path: API_ENDPOINTS.ADMIN.FILMS.LIST, payload });
  const created: TAdminFilmItemResponse = { ...payload, id: nextId++ };
  films = [...films, created];
  emit();
  return created;
};

/** Заглушка PATCH `/admin/films/:id`. */
export const updateFilmStub = async (
  id: number,
  payload: TUpdateFilmRequest
): Promise<TAdminFilmItemResponse | null> => {
  debugStubLog('[manageFilms] UPDATE', { path: API_ENDPOINTS.ADMIN.FILMS.BY_ID(id), payload });
  const index = films.findIndex((f) => f.id === id);
  if (index < 0) return null;
  const updated = { ...films[index], ...payload, id };
  films = films.map((f, i) => (i === index ? updated : f));
  emit();
  return updated;
};

/** Заглушка DELETE `/admin/films/:id`. */
export const deleteFilmStub = async (id: number): Promise<boolean> => {
  debugStubLog('[manageFilms] DELETE', { path: API_ENDPOINTS.ADMIN.FILMS.BY_ID(id) });
  const before = films.length;
  films = films.filter((f) => f.id !== id);
  emit();
  return films.length < before;
};
