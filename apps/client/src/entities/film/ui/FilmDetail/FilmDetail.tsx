"use client"

import { TFilmModel } from '@common/types';
import styles from './FilmDetail.module.scss';
import { FilmDetailProps } from '../types';
import {
  AdditionalInfoBlock,
  DescriptionBlock,
  FactBlock,
  PosterPreviewBlock,
  RatingBlock,
  SloganBlock,
  SummaryBlock,
  TrailerBlock,
  CreatorsViewerBlock
} from './blocks';
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
            smallPictureUrl={film.smallPictureUrl}
            filmNameRu={film.filmNameRu}
            filmNameEn={film.filmNameEn}
          />
          <SloganBlock slogan={film.slogan} />

          <RatingBlock
            ratingKp={film.ratingKp}
            votesKp={film.votesKp}
            filmNameRu={film.filmNameRu}
            filmNameEn={film.filmNameEn}
          />
        </div>

        <div className={styles.infoSection}>
          <SummaryBlock
            filmNameRu={film.filmNameRu}
            filmNameEn={film.filmNameEn}
            year={film.year}
            genres={film.genres}
            movieLength={film.movieLength}
            countries={film.countries}
            isCartoon={isCartoon}
          />

          <DescriptionBlock
            description={film.description || ''}
            filmNameRu={film.filmNameRu}
            filmNameEn={film.filmNameEn}
          />

          <FactBlock fact={film.fact} isCartoon={isCartoon} />

          <CreatorsViewerBlock creatorsViewer={creatorsViewer} />

          <AdditionalInfoBlock />

          <TrailerBlock
            trailerUrl={film.trailerUrl}
            filmNameRu={film.filmNameRu}
            filmNameEn={film.filmNameEn}
          />
        </div>
      </div>
    </div>
  );
};
