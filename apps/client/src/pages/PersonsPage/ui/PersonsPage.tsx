'use client';

import { Layout } from '@/widgets/Layout';
import { PersonCard } from '@/entities/person/ui/PersonCard';
import { InfiniteScroll, Loader } from '@/shared/ui';
import { usePersonsInfiniteScroll } from '@/features/persons/infinite-scroll';
import styles from './PersonsPage.module.scss';

export const PersonsPage = () => {
  const { persons, loading, error, hasMore, loadMore } = usePersonsInfiniteScroll({
    initialPage: 1,
    initialLimit: 20,
  });

  if (loading && persons.length === 0) {
    return (
      <Layout>
        <div className={styles.loaderWrapper}>
          <Loader size="small" />
        </div>
      </Layout>
    );
  }

  if (error && persons.length === 0) {
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

        <InfiniteScroll
          onLoadMore={loadMore}
          isLoading={loading}
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
    </Layout>
  );
};
