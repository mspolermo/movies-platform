import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './SummaryBlock.module.scss';
import { TCountryBased, TGenreBased } from '@common/types';
import { SvgIcon, QualityTag } from '@/shared/ui';
import { SummaryBlockProps } from '../../types';

export const SummaryBlock = ({ 
  filmNameRu, 
  filmNameEn, 
  year, 
  genres = [], 
  movieLength, 
  countries = [] 
}: SummaryBlockProps) => {
  const router = useRouter();

  const filmName = filmNameRu ?? filmNameEn ?? '';

  const getType = (genres: TGenreBased[]) => {
    const isCartoon = genres.find(genre => 
      genre.nameRu === 'мультфильм' || genre.nameEn === 'cartoon'
    );
    return isCartoon ? 'Мультфильм' : 'Фильм';
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}ч. ${mins} мин.`;
  };

  const type = getType(genres);
  const country = countries[0]?.countryName || '';
  const length = movieLength ? formatDuration(movieLength) : '';

  const handleYearClick = () => {
    if (year) {
      router.push(`/films/year/${year}`);
    }
  };

  const handleCountryClick = () => {
    if (countries[0]?.countryName) {
      router.push(`/films/country/${countries[0].countryName}`);
    }
  };

  const handleGenreClick = (genre: TGenreBased) => {
    router.push(`/films/genre/${genre.nameEn}`);
  };

  return (
    <div className={styles.summaryBlock}>
      <h2 className={styles.heading}>
        {filmName} ({type} {year})
      </h2>
      
      <p className={`${styles.text} ${styles.textFirst}`}>
        <span 
          className={styles.link}
          onClick={handleYearClick}
        >
          {year}
        </span>
        <span> {length} </span>
        <span>16+</span>
      </p>
      
      <p className={styles.text}>
        <span 
          className={`${styles.link} ${styles.countryLink}`}
          onClick={handleCountryClick}
        >
          {country}
        </span>

        {genres.map(genre => (
          <span 
            key={genre.id} 
            className={`${styles.link} ${styles.genreLink}`}
            onClick={() => handleGenreClick(genre)}
          >
            <SvgIcon 
              className={styles.svg}
              name="circle-filled" 
              size={4} 
              color="var(--color-text)"
            />
{genre.nameRu}
          </span>
        ))}
      </p>

      <div className={styles.additional}>
        <QualityTag quality="FullHD" />
        <SvgIcon 
          className={styles.svg}
          name="volume-down" 
          size={22} 
          color="var(--color-text)"
        />
        <p className={styles.text}>Рус</p>
        <SvgIcon 
          className={styles.svg}
          name="circle-filled" 
          size={4} 
          color="var(--color-text)"
        />
        <p className={styles.text}>Eng</p>
        <SvgIcon 
          className={styles.svg}
          name="keyboard" 
          size={18} 
          color="var(--color-text)"
          strokeWidth={2}
        />
        <p className={styles.text}>Рус</p>
        <SvgIcon 
          className={styles.svg}
          name="circle-filled" 
          size={4} 
          color="var(--color-text)"
        />
        <p className={styles.text}>Eng</p>
      </div>
    </div>
  );
};
