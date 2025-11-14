'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Layout } from '@/widgets/Layout';
import { personsService, PersonWithFilms } from '@/shared/api/services';
import { PersonHeader, Filmography, ShortMovieCard, Professions } from '@/entities/person';
import { SvgIcon } from '@/shared/ui/SvgIcon';
import { BackArrowIcon } from '@/shared/assets/svg-icons';
import Loader from '@/shared/ui/Loader/Loader';
import styles from './PersonDetailPage.module.scss';

export const PersonDetailPage: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const personId = Number(params?.id);

  const [person, setPerson] = useState<PersonWithFilms | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPerson = async () => {
      try {
        setLoading(true);
        setError(null);
        const personData = await personsService.getPersonById(personId);
        setPerson(personData);
      } catch (err) {
        console.error('Error fetching person:', err);
        setError('Ошибка загрузки данных персоны');
      } finally {
        setLoading(false);
      }
    };

    if (personId) {
      fetchPerson();
    } else {
      setError('ID персоны не найден');
      setLoading(false);
    }
  }, [personId]);

  const handleBackClick = () => {
    router.back();
  };

  if (loading) {
    return (
      <Layout>
        <div className={styles.container}>
          <Loader />
        </div>
      </Layout>
    );
  }

  if (error || !person) {
    return (
      <Layout>
        <div className={styles.container}>
          <div className={styles.error}>{error || 'Персона не найдена'}</div>
        </div>
      </Layout>
    );
  }

  const films = person.films || [];

  return (
    <Layout>
      <div className={styles.actorPage}>
        <div className={styles.actorPage__container}>
          <div className={styles.actorPage__content}>
            <div
              className={styles['actorPage__btn-back']}
              onClick={handleBackClick}
            >
              <SvgIcon
                icon={BackArrowIcon}
                size={40}
                className={styles.actorPage__arrow_small}
              />
              <SvgIcon
                icon={BackArrowIcon}
                size={50}
                className={styles.actorPage__arrow_big}
              />
              Назад
            </div>

            <div className={styles.actorPage__info}>
              <PersonHeader person={person} />

              {person.professions && person.professions.length > 0 && (
                <Professions professions={person.professions} />
              )}

              <div className={styles.actorPage__filmography}>
                <Filmography moviesCount={films.length} />
                <div className={styles.actorPage__filmsList}>
                  {films.map((film) => (
                    <ShortMovieCard key={film.id} film={film} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
