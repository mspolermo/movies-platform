'use client';

import type { TPersonListItemResponse } from '@common/types';

import { useEffect, useState } from 'react';

import { searchPersonsByNameAndProfession } from '@/entities/person';

type TUsePersonSearchQueryParams = {
  professionId: number;
  name: string;
};

/**
 * Поиск персон по имени и профессии (debounce + API). Только загрузка данных, без UI-состояния.
 */
export const usePersonSearchQuery = ({ professionId, name }: TUsePersonSearchQueryParams) => {
  const [results, setResults] = useState<TPersonListItemResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!name) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true);

      try {
        const data = await searchPersonsByNameAndProfession({
          professionId,
          name,
        });

        setResults(data);
      } catch (error) {
        console.error('Ошибка поиска персон', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300); // debounce

    return () => clearTimeout(timeoutId);
  }, [name, professionId]);

  return {
    results,
    isLoading,
  };
};
