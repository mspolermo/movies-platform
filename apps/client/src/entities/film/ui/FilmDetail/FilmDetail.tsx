'use client';

import type { FilmDetailProps } from '../types';

import {
  AdditionalInfoBlock,
  DescriptionBlock,
  FactBlock,
  PosterPreviewBlock,
  RatingBlock,
  SloganBlock,
  SummaryBlock,
  TrailerBlock,
  CreatorsViewerBlock,
} from './blocks';
import styles from './FilmDetail.module.scss';
import { checkIsCartoon } from '../../lib';

export const FilmDetail = (props: FilmDetailProps) => {
  const { film, creatorsViewer } = props;
  const isCartoon = checkIsCartoon(film.genres ?? []);

  return (
    <div className={styles.container}>
      <div className={styles.filmDetail}>
        <div className={styles.posterSection}>
          <PosterPreviewBlock
            bigPictureUrl={film.bigPictureUrl}
            filmNameEn={film.filmNameEn}
            filmNameRu={film.filmNameRu}
            smallPictureUrl={film.smallPictureUrl}
          />
          <SloganBlock slogan={film.slogan} />

          <RatingBlock
            filmNameEn={film.filmNameEn}
            filmNameRu={film.filmNameRu}
            ratingKp={film.ratingKp}
            votesKp={film.votesKp}
          />
        </div>

        <div className={styles.infoSection}>
          <SummaryBlock
            countries={film.countries}
            filmNameEn={film.filmNameEn}
            filmNameRu={film.filmNameRu}
            genres={film.genres}
            isCartoon={isCartoon}
            movieLength={film.movieLength}
            year={film.year}
          />

          <DescriptionBlock
            description={film.description || ''}
            filmNameEn={film.filmNameEn}
            filmNameRu={film.filmNameRu}
          />

          <FactBlock fact={film.fact} isCartoon={isCartoon} />

          <CreatorsViewerBlock creatorsViewer={creatorsViewer} />

          <AdditionalInfoBlock />

          <TrailerBlock
            filmNameEn={film.filmNameEn}
            filmNameRu={film.filmNameRu}
            trailerUrl={film.trailerUrl}
          />
        </div>
      </div>
    </div>
  );
};
