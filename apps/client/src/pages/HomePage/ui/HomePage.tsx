import type { THomePageProps } from '../types';

import { FilmsCarousel } from '@/entities/film';
import { Page } from '@/widgets/Layout';
import { PromoBannerSlider } from '@/widgets/PromoBannerSlider';

import { HomeSeoSection } from './HomeSeoSection';

/** RSC: карусели серверные; интерактив — PromoBannerSlider и HomeSeoSection. */
export const HomePage = ({ genreCarousels }: THomePageProps) => {
  return (
    <Page titleVisuallyHidden title="MovieLand">
      <PromoBannerSlider />
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
