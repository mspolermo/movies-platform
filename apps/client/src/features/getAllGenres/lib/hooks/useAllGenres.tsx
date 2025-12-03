'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TGenreBased } from '@common/types';
import apiClient from '@/shared/api/client';
import { API_ENDPOINTS } from '@/shared/api/endpoints';

export const useAllGenres = () => {
  const router = useRouter();
  const [genres, setGenres] = useState<TGenreBased[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.GENRES.LIST);
        setGenres(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Ошибка загрузки жанров');
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  const handleGenreClick = (genreNameRu: string) => {
    const params = new URLSearchParams();
    params.set('genres', genreNameRu);
    router.push(`/films?${params.toString()}`);
  };

  return {
    loading,
    error,
    genres,
    handleGenreClick
  }
}