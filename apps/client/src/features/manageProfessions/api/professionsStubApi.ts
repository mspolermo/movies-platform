import type {
  TCreateProfessionRequest,
  TProfessionAdminItemResponse,
  TUpdateProfessionRequest,
} from '@common/types';

import { API_ENDPOINTS } from '@/shared/api';
import { debugStubLog } from '@/shared/lib';

/** Начальные данные профессий в памяти (без HTTP). */
const INITIAL: TProfessionAdminItemResponse[] = [
  { id: 1, name: 'Актёр' },
  { id: 2, name: 'Режиссёр' },
  { id: 3, name: 'Сценарист' },
];

let items = [...INITIAL];
let nextId = 4;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

/** Сброс хранилища-заглушки (тесты). */
export const resetProfessionsStub = () => {
  items = INITIAL.map((x) => ({ ...x }));
  nextId = 4;
  emit();
};

/** Подписка на список профессий (заглушка). */
export const subscribeProfessions = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};

/** Снимок списка профессий. */
export const getProfessionsSnapshot = () => items;

/** Заглушка GET `/admin/professions`. */
export const listProfessionsStub = async (): Promise<TProfessionAdminItemResponse[]> => {
  debugStubLog('[manageProfessions] LIST', { path: API_ENDPOINTS.ADMIN.PROFESSIONS.LIST });
  return items;
};

/** Заглушка POST `/admin/professions`. */
export const createProfessionStub = async (
  payload: TCreateProfessionRequest
): Promise<TProfessionAdminItemResponse> => {
  debugStubLog('[manageProfessions] CREATE', {
    path: API_ENDPOINTS.ADMIN.PROFESSIONS.LIST,
    payload,
  });
  const created = { ...payload, id: nextId++ };
  items = [...items, created];
  emit();
  return created;
};

/** Заглушка PATCH `/admin/professions/:id`. */
export const updateProfessionStub = async (
  id: number,
  payload: TUpdateProfessionRequest
): Promise<TProfessionAdminItemResponse | null> => {
  debugStubLog('[manageProfessions] UPDATE', {
    path: API_ENDPOINTS.ADMIN.PROFESSIONS.BY_ID(id),
    payload,
  });
  const i = items.findIndex((x) => x.id === id);
  if (i < 0) return null;
  const updated = { ...items[i], ...payload, id };
  items = items.map((x, idx) => (idx === i ? updated : x));
  emit();
  return updated;
};

/** Заглушка DELETE `/admin/professions/:id`.
 * Осиротевшие professionIds у персон чистит бэкенд (Restrict/Cascade); FE-заглушка persons store не трогает.
 */
export const deleteProfessionStub = async (id: number): Promise<boolean> => {
  debugStubLog('[manageProfessions] DELETE', {
    path: API_ENDPOINTS.ADMIN.PROFESSIONS.BY_ID(id),
  });
  const before = items.length;
  items = items.filter((x) => x.id !== id);
  emit();
  return items.length < before;
};
