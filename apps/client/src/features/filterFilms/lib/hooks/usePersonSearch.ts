import { searchPersonsByNameAndProfession } from '@/entities/person';
import { TPersonModel } from '@common/types';
import { useEffect, useState } from 'react';

interface UsePersonSearchParams {
  professionId: number;
  name: string;
}

export const usePersonSearch = ({
  professionId,
  name,
}: {
  professionId: number;
  name: string;
}) => {
  const [results, setResults] = useState<TPersonModel[]>([]);
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
