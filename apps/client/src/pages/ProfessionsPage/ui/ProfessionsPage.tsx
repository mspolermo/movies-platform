'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Layout } from '@/widgets/Layout';
import { TProfessionBased } from '@common/types';
import { professionsService } from '@/shared/api/services';
import { ProfessionsTabs } from '@/features/professions/tabs';
import { useProfessionPersons } from '@/features/professions/persons';
import { PersonCard } from '@/entities/person/ui/PersonCard';
import { InfiniteScroll, Loader } from '@/shared/ui';
import styles from './ProfessionsPage.module.scss';

export const ProfessionsPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [professions, setProfessions] = useState<TProfessionBased[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeProfessionId, setActiveProfessionId] = useState<number | null>(null);

  const {
    persons,
    loading: personsLoading,
    error: personsError,
    hasMore,
    loadMore,
  } = useProfessionPersons({
    professionId: activeProfessionId,
    initialPage: 1,
    initialLimit: 20,
  });

  useEffect(() => {
    const fetchProfessions = async () => {
      try {
        const data = await professionsService.getAllProfessions();
        setProfessions(data);
        setError(null);
        
        // Проверяем query-параметр profession
        const professionParam = searchParams.get('profession');
        
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
      } catch (err: any) {
        setError(err.response?.data?.message || 'Ошибка загрузки профессий');
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
      const params = new URLSearchParams(searchParams.toString());
      params.set('profession', profession.name);
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className={styles.loaderWrapper}>
          <Loader size="small" />
        </div>
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

        {professions.length > 0 && (
          <div className={styles.content}>
            <ProfessionsTabs
              professions={professions}
              activeProfessionId={activeProfessionId}
              onProfessionChange={handleProfessionChange}
            />

            {activeProfessionId && (
              <div className={styles.personsSection}>
                {personsError && (
                  <div className={styles.error}>{personsError}</div>
                )}

                {persons.length === 0 && !personsLoading && (
                  <div className={styles.emptyState}>
                    Нет персон в этой профессии
                  </div>
                )}

                <InfiniteScroll
                  onLoadMore={loadMore}
                  isLoading={personsLoading}
                  hasMore={hasMore}
                  className={styles.infiniteScroll}
                >
                  <div className={styles.personsGrid}>
                    {persons.map((person) => (
                      <PersonCard key={person.id} person={person} />
                    ))}
                  </div>
                </InfiniteScroll>
              </div>
            )}
          </div>
        )}

        {professions.length === 0 && (
          <div className={styles.emptyState}>Нет доступных профессий</div>
        )}
      </div>
    </Layout>
  );
};
