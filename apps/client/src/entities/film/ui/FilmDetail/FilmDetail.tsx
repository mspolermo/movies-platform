'use client';

import type { FilmDetailProps } from './types';

import { ExpandableBlock, RemotePoster, Skeleton } from '@/shared/ui';

import styles from './FilmDetail.module.scss';
import { QualityInfo, Description, Facts, Rating, Slogan, Summary, Trailer } from './ui';
import { resolveFilmPosterUrl } from '../../lib';

/** Детальная информация фильма:
 * постер, рейтинг, описание, факты, трейлер.
 * Отображение скелетона при загрузке.
 * Принимает готовый блок создателей(персон) и панель действий.
 * */
export const FilmDetail = (props: FilmDetailProps) => {
  const { film, creatorsViewer, actionsPanel, isLoading } = props;

  if (isLoading || !film) {
    return (
      <div className={styles.container}>
        <div className={styles.preview}>
          <Skeleton height="400px" />
          <Skeleton height="72px" />
          <Skeleton height="72px" />
        </div>
        <div className={styles.info}>
          <Skeleton height="36px" width="50%" />
          <Skeleton height="64px" width="50%" />
          <Skeleton height="250px" />
          <Skeleton height="154px" />
        </div>
      </div>
    );
  }

  const filmTitle = film.filmNameRu || film.filmNameEn || '';

  return (
    <div className={styles.container}>
      <div className={styles.preview}>
        <div className={styles.posterSlot}>
          <RemotePoster
            priority
            alt={filmTitle}
            className={styles.poster}
            imageClassName={styles.posterImage}
            size="l"
            skeletonClassName={styles.posterSkeleton}
            src={resolveFilmPosterUrl(film, 'big')}
          />
        </div>
        {actionsPanel ? <div className={styles.actionsPanel}>{actionsPanel}</div> : null}
        <Slogan film={film} />
        <Rating film={film} />
      </div>

      <div className={styles.info}>
        <Summary film={film} />
        <Description film={film} />
        <Facts film={film} />

        <ExpandableBlock
          collapseLabel="Скрыть создателей и актёров"
          expandLabel="Смотреть создателей и актёров"
        >
          {creatorsViewer}
        </ExpandableBlock>

        <QualityInfo view="mobile" />

        <div className={styles.trailerDesctop}>
          <Trailer film={film} />
        </div>
      </div>

      <div className={styles.trailerTablet}>
        <Trailer film={film} />
      </div>
    </div>
  );
};
