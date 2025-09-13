import { TFilmModel } from '@common/types';
import styles from './FilmDetail.module.scss';
import { FilmDetailProps } from '../types';
import { 
  AdditionalInfoBlock, 
  CardsBlock, 
  DescriptionBlock, 
  PosterPreviewBlock,
  SloganBlock, 
  SummaryBlock,
  TrailerBlock
} from './blocks';

export const FilmDetail = (props: FilmDetailProps) => {
  const { film } = props;

  return (
    <div className={styles.container}>
      <div className={styles.filmDetail}>
        <div className={styles.posterSection}>
          <PosterPreviewBlock 
            posterUrl={film.bigPictureUrl || film.smallPictureUrl}
            alt={film.filmNameRu}
          />
          <SloganBlock slogan={film.slogan} />
        </div>
        
        <div className={styles.infoSection}>
        
          <SummaryBlock 
            filmName={film.filmNameRu}
            year={film.year}
            genres={film.genres}
            movieLength={film.movieLength}
            countries={film.countries}
          />

          <DescriptionBlock 
            description={film.description || ''}
            filmName={film.filmNameRu}
          />

          <CardsBlock 
            ratingKp={film.ratingKp}
            persons={film.persons}
          />

          <AdditionalInfoBlock />

          <TrailerBlock 
            trailerUrl={film.trailerUrl}
            filmName={film.filmNameRu}
          />
        </div>
      </div>
    </div>
  );
};