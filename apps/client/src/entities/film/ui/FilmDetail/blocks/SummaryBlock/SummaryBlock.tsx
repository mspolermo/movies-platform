import type { SummaryBlockProps } from '../../types';

import { useRouter } from 'next/navigation';

import { SvgIcon, QualityTag } from '@/shared/ui';

import styles from './SummaryBlock.module.scss';

export const SummaryBlock = ({
  filmNameRu,
  filmNameEn,
  year,
  genres = [],
  movieLength,
  countries = [],
  isCartoon,
}: SummaryBlockProps) => {
  const router = useRouter();

  const filmName = filmNameRu ?? filmNameEn ?? '';

  const getType = () => {
    return isCartoon ? 'Мультфильм' : 'Фильм';
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}ч. ${mins} мин.`;
  };

  const type = getType();
  const country = countries[0]?.countryName || '';
  const length = movieLength ? formatDuration(movieLength) : '';

  const handleYearClick = () => {
    if (year) {
      router.push(`/films?year=${year}`);
    }
  };

  const handleCountryClick = () => {
    if (countries[0]?.countryName) {
      router.push(`/films?countries=${countries[0].countryName}`);
    }
  };

  const handleGenreClick = (genre: string) => {
    router.push(`/films?genres=${genre}`);
  };

  return (
    <div className={styles.summaryBlock}>
      <h2 className={styles.heading}>
        {filmName} ({type} {year})
      </h2>

      <p className={`${styles.text} ${styles.textFirst}`}>
        <span className={styles.link} onClick={handleYearClick}>
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

        {genres.map((genre, id) => (
          <span
            key={`${genre.nameEn}-${id}`}
            className={`${styles.link} ${styles.genreLink}`}
            onClick={() => handleGenreClick(genre.nameEn)}
          >
            <SvgIcon
              className={styles.svg}
              color="var(--color-text)"
              name="circle-filled"
              size={4}
            />
            {genre.nameRu}
          </span>
        ))}
      </p>

      <div className={styles.additional}>
        <QualityTag quality="FullHD" />
        <SvgIcon
          className={styles.svg}
          color="var(--color-text)"
          name="volume-down"
          size={22}
        />
        <p className={styles.text}>Рус</p>
        <SvgIcon
          className={styles.svg}
          color="var(--color-text)"
          name="circle-filled"
          size={4}
        />
        <p className={styles.text}>Eng</p>
        <SvgIcon
          className={styles.svg}
          color="var(--color-text)"
          name="keyboard"
          size={18}
          strokeWidth={2}
        />
        <p className={styles.text}>Рус</p>
        <SvgIcon
          className={styles.svg}
          color="var(--color-text)"
          name="circle-filled"
          size={4}
        />
        <p className={styles.text}>Eng</p>
      </div>
    </div>
  );
};
