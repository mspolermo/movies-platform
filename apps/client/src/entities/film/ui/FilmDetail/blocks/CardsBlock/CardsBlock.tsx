'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { FilmProfessionsSlider } from '@/features/film/profession-slider';
import { FilmPersonsList } from '@/features/film/persons-by-profession';
import { filmsService } from '@/shared/api/services';
import { TProfessionBased } from '@common/types';
import styles from './CardsBlock.module.scss';
import { CardsBlockProps } from '../../types';

export const CardsBlock = ({ professions = [] }: CardsBlockProps) => {
  const params = useParams();
  const filmId = Number(params?.id);
  const [filmProfessions, setFilmProfessions] = useState<TProfessionBased[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeProfessionName, setActiveProfessionName] = useState<string | null>(null);
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
          setActiveProfessionName((prev) => prev || data[0].name);
        }
      } catch (err) {
        console.error('Error fetching film professions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessions();
  }, [filmId]);

  const handleProfessionChange = (professionName: string) => {
    setActiveProfessionName(professionName);
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
          <FilmProfessionsSlider
            professions={filmProfessions}
            activeProfessionName={activeProfessionName}
            onProfessionChange={handleProfessionChange}
          />
          {activeProfessionName && (
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
