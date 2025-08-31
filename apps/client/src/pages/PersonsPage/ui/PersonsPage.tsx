'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/widgets/Layout';
import { TPersonBased } from '@common/types';
import apiClient from '@/shared/api/client';
import { API_ENDPOINTS } from '@/shared/api/endpoints';
import styles from './PersonsPage.module.scss';

export const PersonsPage = () => {
  const [persons, setPersons] = useState<TPersonBased[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPersons = async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.PERSONS.LIST);
        setPersons(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Ошибка загрузки персон');
      } finally {
        setLoading(false);
      }
    };

    fetchPersons();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className={styles.loading}>Загрузка...</div>
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
        <h1 className={styles.title}>Персоны</h1>
        
        <div className={styles.personsGrid}>
          {persons.map((person) => (
            <div key={person.id} className={styles.personCard}>
              <div className={styles.personPhoto}>
                {person.photoUrl ? (
                  <img src={person.photoUrl} alt={person.nameRu} className={styles.photo} />
                ) : (
                  <div className={styles.photoPlaceholder}>
                    {person.nameRu.charAt(0)}
                  </div>
                )}
              </div>
              <h3 className={styles.personName}>{person.nameRu}</h3>
              {person.nameEn && person.nameEn !== person.nameRu && (
                <p className={styles.personNameEn}>{person.nameEn}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
