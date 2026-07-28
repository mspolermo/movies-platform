import type {
  TCreatePersonRequest,
  TPersonAdminItemResponse,
  TUpdatePersonRequest,
} from '@common/types';

import { API_ENDPOINTS } from '@/shared/api';
import { debugStubLog } from '@/shared/lib';

/** Начальные данные персон в памяти (без HTTP). */
const INITIAL: TPersonAdminItemResponse[] = [
  {
    id: 1,
    nameRu: 'Киану Ривз',
    nameEn: 'Keanu Reeves',
    photoUrl: '',
    professionIds: [1],
  },
  {
    id: 2,
    nameRu: 'Кристофер Нолан',
    nameEn: 'Christopher Nolan',
    photoUrl: '',
    professionIds: [2, 3],
  },
];

let items = [...INITIAL];
let nextId = 3;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

/** Сброс хранилища-заглушки (тесты). */
export const resetPersonsStub = () => {
  items = INITIAL.map((x) => ({ ...x, professionIds: [...x.professionIds] }));
  nextId = 3;
  emit();
};

/** Подписка на список персон (заглушка). */
export const subscribePersons = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};

/** Снимок списка персон. */
export const getPersonsSnapshot = () => items;

/** Заглушка GET `/admin/persons` (опциональный ?q=, фильтр на клиенте). */
export const listPersonsStub = async (q?: string): Promise<TPersonAdminItemResponse[]> => {
  debugStubLog('[managePersons] LIST', { path: API_ENDPOINTS.ADMIN.PERSONS.LIST, q });
  const normalized = q?.trim().toLowerCase();
  if (!normalized) return items;
  return items.filter(
    (x) =>
      x.nameRu.toLowerCase().includes(normalized) || x.nameEn.toLowerCase().includes(normalized)
  );
};

/** Заглушка POST `/admin/persons`. */
export const createPersonStub = async (
  payload: TCreatePersonRequest
): Promise<TPersonAdminItemResponse> => {
  debugStubLog('[managePersons] CREATE', { path: API_ENDPOINTS.ADMIN.PERSONS.LIST, payload });
  const created: TPersonAdminItemResponse = { ...payload, id: nextId++ };
  items = [...items, created];
  emit();
  return created;
};

/** Заглушка PATCH `/admin/persons/:id`. */
export const updatePersonStub = async (
  id: number,
  payload: TUpdatePersonRequest
): Promise<TPersonAdminItemResponse | null> => {
  debugStubLog('[managePersons] UPDATE', { path: API_ENDPOINTS.ADMIN.PERSONS.BY_ID(id), payload });
  const i = items.findIndex((x) => x.id === id);
  if (i < 0) return null;
  const updated = { ...items[i], ...payload, id };
  items = items.map((x, idx) => (idx === i ? updated : x));
  emit();
  return updated;
};

/** Заглушка DELETE `/admin/persons/:id`. */
export const deletePersonStub = async (id: number): Promise<boolean> => {
  debugStubLog('[managePersons] DELETE', { path: API_ENDPOINTS.ADMIN.PERSONS.BY_ID(id) });
  const before = items.length;
  items = items.filter((x) => x.id !== id);
  emit();
  return items.length < before;
};
