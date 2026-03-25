import type { SummaryProps } from '../../types';

import { useRouter } from 'next/navigation';

import { SvgIcon, QualityTag } from '@/shared/ui';

import styles from './Summary.module.scss';
import { checkIsCartoon, formatDuration } from '../../../../lib';

/**
 * Блок основной информации о фильме.
 */
export const Summary = ({
  film: { filmNameRu, filmNameEn, year, genres, movieLength, countries },
}: SummaryProps) => {
  const router = useRouter();

  const filmName = filmNameRu ?? filmNameEn ?? '';
  const type = checkIsCartoon(genres ?? []) ? 'Мультфильм' : 'Фильм';
  const country = countries?.[0]?.countryName;
  const duration = movieLength ? formatDuration(movieLength) : null;

  const navigate = (query: string) => {
    router.push(`/films?${query}`);
  };

  return (
    <section className={styles.root}>
      <h2 className={styles.title}>
        {filmName} ({type} {year})
      </h2>

      <div className={styles.row}>
        {year && (
          <button className={styles.link} onClick={() => navigate(`year=${year}`)}>
            {year}
          </button>
        )}

        {duration && <span>{duration}</span>}
        <span>16+</span>
      </div>

      <div className={styles.row}>
        {country && (
          <button className={styles.link} onClick={() => navigate(`countries=${country}`)}>
            {country}
          </button>
        )}

        {genres?.map((genre) => (
          <button
            key={genre.nameEn}
            className={styles.link}
            onClick={() => navigate(`genres=${genre.nameEn}`)}
          >
            <SvgIcon name="circle-filled" size={4} />
            {genre.nameRu}
          </button>
        ))}
      </div>

      <div className={styles.meta}>
        <QualityTag quality="FullHD" />

        <SvgIcon name="volume-down" size={22} />
        <span>Рус</span>
        <span className={styles.dot} />

        <span>Eng</span>

        <SvgIcon name="keyboard" size={18} strokeWidth={2} />
        <span>Рус</span>
        <span className={styles.dot} />
        <span>Eng</span>
      </div>
    </section>
  );
};
