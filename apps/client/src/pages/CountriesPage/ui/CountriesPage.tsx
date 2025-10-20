'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/widgets/Layout';
import { TCountryBased } from '@common/types';
import apiClient from '@/shared/api/client';
import { API_ENDPOINTS } from '@/shared/api/endpoints';
import styles from './CountriesPage.module.scss';
import { Loader } from '@/shared/ui';

export const CountriesPage = () => {
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

  if (loading) {
    return (
      <Layout>
        <Loader size="small" />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className={styles.error}>{error}</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.container}>
        <h1 className={styles.title}>Страны</h1>

        <div className={styles.countriesGrid}>
          {countries.map((country) => (
            <div key={country.id} className={styles.countryCard}>
              <h3 className={styles.countryName}>{country.countryName}</h3>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};
