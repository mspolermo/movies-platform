'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { FilmPersonsList } from '@/features/film/persons-by-profession';
import { filmsService } from '@/shared/api/services';
import { TProfessionBased } from '@common/types';
import styles from './ProfessionsViewer.module.scss';
import { ProfessionsViewerProps } from '../types';
import { ProfessionsSlider } from '@/features/professions/slider';

export const ProfessionsViewer = ({ professions = [] }: ProfessionsViewerProps) => {
  const params = useParams();
  const filmId = Number(params?.id);
  const [filmProfessions, setFilmProfessions] = useState<TProfessionBased[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeProfessionId, setActiveProfessionId] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchProfessions = async () => {
      if (!filmId) return;

      try {
        setLoading(true);
        const data = await filmsService.getFilmProfessions(filmId);
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

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  if (loading) {
    return null;
  }

  if (filmProfessions.length === 0) {
    return null;
  }

  const activeProfessionName = filmProfessions.find((profession) => profession.id === activeProfessionId)?.name ?? null

  return (
    <div className={styles.cardsBlock}>
      <h3
        className={`${styles.title} ${styles.titleClickable}`}
        onClick={toggleExpanded}
      >
        {isExpanded ? 'Скрыть создателей и актёров' : 'Смотреть создателей и актёров'}
      </h3>
      {isExpanded && (
        <>
          <ProfessionsSlider
            professions={filmProfessions}
            activeProfessionId={activeProfessionId}
            onProfessionChange={handleProfessionChange}
          />
          {activeProfessionId && (
            <FilmPersonsList
              filmId={filmId}
              professionName={activeProfessionName}
            />
          )}
        </>
      )}
    </div>
  );
};
