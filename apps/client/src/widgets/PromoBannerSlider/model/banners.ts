import type { StaticImageData } from 'next/image';

import { banner0, banner1, banner2, banner3, banner4 } from '../assets';

export type TPromoBanner = {
  id: string;
  src: StaticImageData;
  alt: string;
};

export const PROMO_BANNERS: TPromoBanner[] = [
  {
    id: 'banner-0',
    src: banner0,
    alt: 'Рекламный баннер 1',
  },
  {
    id: 'banner-1',
    src: banner1,
    alt: 'Рекламный баннер 2',
  },
  {
    id: 'banner-2',
    src: banner2,
    alt: 'Рекламный баннер 3',
  },
  {
    id: 'banner-3',
    src: banner3,
    alt: 'Рекламный баннер 4',
  },
  {
    id: 'banner-4',
    src: banner4,
    alt: 'Рекламный баннер 5',
  },
];
