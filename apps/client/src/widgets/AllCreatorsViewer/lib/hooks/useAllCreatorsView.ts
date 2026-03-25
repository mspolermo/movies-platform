import type { TAllCreatorsViewerProps } from '../../models';
import type { TProfessionItemResponse } from '@common/types';

import { isAxiosError } from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { getAllProfessions } from '@/entities/profession';

/**
 * Хук для загрузки списка всех профессий и управления активной профессией
 * в режиме "All Creators Viewer".
 *
 * Позволяет:
 * - загружать все профессии с сервера
 * - автоматически определять активную профессию на основе query-параметра `profession`
 * - синхронизировать изменение профессии с URL-параметрами
 * - обрабатывать состояния загрузки и ошибок
 */
export const useAllCreatorsView = ({ searchParams }: TAllCreatorsViewerProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [professions, setProfessions] = useState<TProfessionItemResponse[]>([]);
  const [activeProfessionId, setActiveProfessionId] = useState<number | null>(null);

  useEffect(() => {
    const fetchProfessions = async () => {
      try {
        const data = await getAllProfessions();
        setProfessions(data);
        setError(null);

        // Проверяем query-параметр profession
        const professionParam = searchParams?.get('profession');

        if (professionParam && data.length > 0) {
          // Ищем профессию по названию (без учета регистра)
          const foundProfession = data.find(
            (p) => p.name.toLowerCase() === professionParam.toLowerCase()
          );
          if (foundProfession) {
            setActiveProfessionId(foundProfession.id);
          } else {
            // Если профессия не найдена, выбираем первую
            setActiveProfessionId(data[0].id);
          }
        } else if (data.length > 0 && activeProfessionId === null) {
          // Автоматически выбираем первую профессию, если нет query-параметра
          setActiveProfessionId(data[0].id);
        }
      } catch (err: unknown) {
        const fallback = 'Ошибка загрузки профессий';
        const msg =
          isAxiosError(err) &&
          err.response?.data &&
          typeof err.response.data === 'object' &&
          err.response.data !== null &&
          'message' in err.response.data &&
          typeof (err.response.data as { message: unknown }).message === 'string'
            ? (err.response.data as { message: string }).message
            : fallback;
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleProfessionChange = (professionId: number) => {
    setActiveProfessionId(professionId);

    // Обновляем query-параметр в URL
    const profession = professions.find((p) => p.id === professionId);
    if (profession) {
      const params = new URLSearchParams(searchParams?.toString());
      params.set('profession', profession.name);
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  return {
    professions,
    activeProfessionId,
    loading,
    error,
    handleProfessionChange,
  };
};
