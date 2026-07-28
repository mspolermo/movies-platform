import type {
  TCountryAdminItemResponse,
  TCreateCountryRequest,
  TUpdateCountryRequest,
} from '@common/types';

import { API_ENDPOINTS } from '@/shared/api';
import { debugStubLog } from '@/shared/lib';

/** Начальные данные стран в памяти (без HTTP). */
const INITIAL: TCountryAdminItemResponse[] = [
  { id: 1, countryName: 'Россия', countryNameEn: 'Russia' },
  { id: 2, countryName: 'США', countryNameEn: 'USA' },
];

let items = [...INITIAL];
let nextId = 3;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

/** Сброс хранилища-заглушки (тесты). */
export const resetCountriesStub = () => {
  items = INITIAL.map((x) => ({ ...x }));
  nextId = 3;
  emit();
};

/** Подписка на список стран (заглушка). */
export const subscribeCountries = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};

/** Снимок списка стран. */
export const getCountriesSnapshot = () => items;

/** Заглушка GET `/admin/countries`. */
export const listCountriesStub = async (): Promise<TCountryAdminItemResponse[]> => {
  debugStubLog('[manageCountries] LIST', { path: API_ENDPOINTS.ADMIN.COUNTRIES.LIST });
  return items;
};

/** Заглушка POST `/admin/countries`. */
export const createCountryStub = async (
  payload: TCreateCountryRequest
): Promise<TCountryAdminItemResponse> => {
  debugStubLog('[manageCountries] CREATE', { path: API_ENDPOINTS.ADMIN.COUNTRIES.LIST, payload });
  const created = { ...payload, id: nextId++ };
  items = [...items, created];
  emit();
  return created;
};

/** Заглушка PATCH `/admin/countries/:id`. */
export const updateCountryStub = async (
  id: number,
  payload: TUpdateCountryRequest
): Promise<TCountryAdminItemResponse | null> => {
  debugStubLog('[manageCountries] UPDATE', {
    path: API_ENDPOINTS.ADMIN.COUNTRIES.BY_ID(id),
    payload,
  });
  const i = items.findIndex((x) => x.id === id);
  if (i < 0) return null;
  const updated = { ...items[i], ...payload, id };
  items = items.map((x, idx) => (idx === i ? updated : x));
  emit();
  return updated;
};

/** Заглушка DELETE `/admin/countries/:id`. */
export const deleteCountryStub = async (id: number): Promise<boolean> => {
  debugStubLog('[manageCountries] DELETE', { path: API_ENDPOINTS.ADMIN.COUNTRIES.BY_ID(id) });
  const before = items.length;
  items = items.filter((x) => x.id !== id);
  emit();
  return items.length < before;
};
