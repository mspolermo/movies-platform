import type {
  TCreateGenreRequest,
  TGenreAdminItemResponse,
  TUpdateGenreRequest,
} from '@common/types';

import { API_ENDPOINTS } from '@/shared/api';
import { debugStubLog } from '@/shared/lib';

/** Начальные данные жанров в памяти (без HTTP). */
const INITIAL: TGenreAdminItemResponse[] = [
  { id: 1, nameRu: 'Драма', nameEn: 'Drama' },
  { id: 2, nameRu: 'Комедия', nameEn: 'Comedy' },
  { id: 3, nameRu: 'Боевик', nameEn: 'Action' },
];

let items = [...INITIAL];
let nextId = 4;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

/** Сброс хранилища-заглушки (тесты). */
export const resetGenresStub = () => {
  items = INITIAL.map((x) => ({ ...x }));
  nextId = 4;
  emit();
};

/** Подписка на список жанров (заглушка). */
export const subscribeGenres = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};

/** Снимок списка жанров. */
export const getGenresSnapshot = () => items;

/** Заглушка GET `/admin/genres`. */
export const listGenresStub = async (): Promise<TGenreAdminItemResponse[]> => {
  debugStubLog('[manageGenres] LIST', { path: API_ENDPOINTS.ADMIN.GENRES.LIST });
  return items;
};

/** Заглушка POST `/admin/genres`. */
export const createGenreStub = async (
  payload: TCreateGenreRequest
): Promise<TGenreAdminItemResponse> => {
  debugStubLog('[manageGenres] CREATE', { path: API_ENDPOINTS.ADMIN.GENRES.LIST, payload });
  const created = { ...payload, id: nextId++ };
  items = [...items, created];
  emit();
  return created;
};

/** Заглушка PATCH `/admin/genres/:id`. */
export const updateGenreStub = async (
  id: number,
  payload: TUpdateGenreRequest
): Promise<TGenreAdminItemResponse | null> => {
  debugStubLog('[manageGenres] UPDATE', { path: API_ENDPOINTS.ADMIN.GENRES.BY_ID(id), payload });
  const i = items.findIndex((x) => x.id === id);
  if (i < 0) return null;
  const updated = { ...items[i], ...payload, id };
  items = items.map((x, idx) => (idx === i ? updated : x));
  emit();
  return updated;
};

/** Заглушка DELETE `/admin/genres/:id`. */
export const deleteGenreStub = async (id: number): Promise<boolean> => {
  debugStubLog('[manageGenres] DELETE', { path: API_ENDPOINTS.ADMIN.GENRES.BY_ID(id) });
  const before = items.length;
  items = items.filter((x) => x.id !== id);
  emit();
  return items.length < before;
};
