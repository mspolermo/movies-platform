'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TCountryBased } from '@common/types';
import apiClient from '@/shared/api/client';
import { API_ENDPOINTS } from '@/shared/api/endpoints';

export const useAllCountries = () => {
  const router = useRouter();
  const [countries, setCountries] = useState<TCountryBased[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.COUNTRIES.LIST);
        setCountries(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Ошибка загрузки стран');
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const handleCountryClick = (countryName: string) => {
    const params = new URLSearchParams();
    params.set('countries', countryName);
    router.push(`/films?${params.toString()}`);
  };

  return {
    loading,
    error,
    countries,
    handleCountryClick
  }
}