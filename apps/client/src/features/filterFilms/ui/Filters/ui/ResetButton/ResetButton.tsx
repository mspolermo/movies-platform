'use client';

import type { TResetButtonProps } from '../../../../model';

import { MOBILE_BREAKPOINT } from '@/shared/constants';
import { useMediaQuery } from '@/shared/lib';

import { LaptopResetButton } from './LaptopResetButton';
import { MobileResetButton } from './MobileResetButton';

const MOBILE_QUERY = `(max-width: ${MOBILE_BREAKPOINT}px)`;

/**
 * Кнопка сброса фильтров фильмов к значениям по умолчанию.
 */
export const ResetButton = (props: TResetButtonProps) => {
  const isMobile = useMediaQuery(MOBILE_QUERY);

  return isMobile ? <MobileResetButton {...props} /> : <LaptopResetButton {...props} />;
};
