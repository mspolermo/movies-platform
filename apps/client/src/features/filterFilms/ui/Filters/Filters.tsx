'use client';

import type { TFilmFiltersProps } from '../../model';

import { MOBILE_BREAKPOINT, TABLET_BREAKPOINT } from '@/shared/constants';
import { useMediaQuery } from '@/shared/lib';

import { LaptopFilters } from './LaptopFilters';
import { MobileFilters } from './MobileFilters';
import { TabletFilters } from './TabletFilters';

const MOBILE_QUERY = `(max-width: ${MOBILE_BREAKPOINT}px)`;
const TABLET_QUERY = `(max-width: ${TABLET_BREAKPOINT}px)`;

export const Filters = (props: TFilmFiltersProps) => {
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const isTablet = useMediaQuery(TABLET_QUERY);

  if (isMobile) {
    return <MobileFilters {...props} />;
  }

  if (isTablet) {
    return <TabletFilters {...props} />;
  }

  return <LaptopFilters {...props} />;
};
