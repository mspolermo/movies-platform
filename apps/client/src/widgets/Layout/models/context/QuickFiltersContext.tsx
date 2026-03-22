'use client';

import type { TQuickFiltersResponse } from '@common/types';

import { createContext, type ReactNode } from 'react';

/**
 * Контекст быстрых фильтров хедера (жанры / страны / годы).
 * Заполняется из SSR (`app/layout` → `Layout`), читается в `useQuickFiltersData`.
 */
export const QuickFiltersContext = createContext<TQuickFiltersResponse | null>(
  null
);

/**
 * Пробрасывает `initialQuickFilters` с сервера в дерево под хедером без клиентского запроса.
 */
export function QuickFiltersProvider({
  value,
  children,
}: {
  value: TQuickFiltersResponse;
  children: ReactNode;
}) {
  return (
    <QuickFiltersContext.Provider value={value}>
      {children}
    </QuickFiltersContext.Provider>
  );
}
