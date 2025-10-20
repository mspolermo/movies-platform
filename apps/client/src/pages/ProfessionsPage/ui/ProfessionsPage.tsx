'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/widgets/Layout';
import { TProfessionBased } from '@common/types';
import apiClient from '@/shared/api/client';
import { API_ENDPOINTS } from '@/shared/api/endpoints';
import styles from './ProfessionsPage.module.scss';
import { Loader } from '@/shared/ui';

export const ProfessionsPage = () => {
  const [professions, setProfessions] = useState<TProfessionBased[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfessions = async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.PROFESSIONS.LIST);
        setProfessions(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Ошибка загрузки профессий');
      } finally {
        setLoading(false);
      }
    };

    fetchProfessions();
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
        <h1 className={styles.title}>Профессии</h1>

        <div className={styles.professionsGrid}>
          {professions.map((profession) => (
            <div key={profession.id} className={styles.professionCard}>
              <h3 className={styles.professionName}>{profession.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};
