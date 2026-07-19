import type { THomePageProps } from '../types';

import { FilmsCarousel } from '@/entities/film';
import { Page } from '@/widgets/Layout';

import { HomeSeoSection } from './HomeSeoSection';

/** RSC: карусели серверные, интерактив только в HomeSeoSection. */
export const HomePage = ({ genreCarousels }: THomePageProps) => {
  return (
    <Page title="MovieLand">
      {genreCarousels.map((carousel, index) => (
        <FilmsCarousel
          key={carousel.genreKey}
          films={carousel.films}
          priorityCount={index === 0 ? 4 : 0}
          title={carousel.title}
        />
      ))}
      <HomeSeoSection />
    </Page>
  );
};
