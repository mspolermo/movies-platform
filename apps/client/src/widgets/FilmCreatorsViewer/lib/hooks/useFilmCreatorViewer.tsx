import type { TProfessionItemResponse } from '@common/types';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { getFilmProfessions } from '@/entities/profession';

/**
 * Хук для получения и управления списком профессий, связанных с фильмом.
 *
 * Выполняет загрузку профессий по `filmId`, автоматически выставляет первую
 * профессию активной и предоставляет удобные данные и методы для работы
 * с "просмотрщиком создателей" (creator viewer).
 *
 */
export const useFilmCreatorViewer = () => {
  const params = useParams();
  const filmId = Number(params?.id);
  const [filmProfessions, setFilmProfessions] = useState<
    TProfessionItemResponse[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [activeProfessionId, setActiveProfessionId] = useState<number | null>(
    null
  );

  const activeProfessionName =
    filmProfessions.find((profession) => profession.id === activeProfessionId)
      ?.name ?? null;

  useEffect(() => {
    const fetchProfessions = async () => {
      if (!filmId) return;

      try {
        setLoading(true);
        const data = await getFilmProfessions(filmId);
        setFilmProfessions(data);

        // Автоматически выбираем первую профессию, если есть
        if (data.length > 0) {
          setActiveProfessionId((prev) => prev || data[0].id);
        }
      } catch (err) {
        console.error('Error fetching film professions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessions();
  }, [filmId]);

  const handleProfessionChange = (id: number) => {
    setActiveProfessionId(id);
  };

  return {
    filmProfessions,
    loading,
    activeProfessionId,
    filmId,
    activeProfessionName,
    handleProfessionChange,
  };
};
