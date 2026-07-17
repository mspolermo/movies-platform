import type { THomePageProps } from '../types';

import { FilmsCarousel } from '@/entities/film';
import { Page } from '@/widgets/Layout';

import { HomeSeoSection } from './HomeSeoSection';

/** RSC: карусели серверные, интерактив только в HomeSeoSection. */
export const HomePage = ({ genreCarousels }: THomePageProps) => {
  return (
    <Page title="MovieLand">
      {genreCarousels.map((carousel) => (
        <FilmsCarousel key={carousel.genreKey} films={carousel.films} title={carousel.title} />
      ))}
      <HomeSeoSection />
    </Page>
  );
};
