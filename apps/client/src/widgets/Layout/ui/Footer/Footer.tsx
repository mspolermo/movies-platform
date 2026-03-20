'use client';

import { TABLET_BREAKPOINT } from '@/shared/constants';
import { useMediaQuery } from '@/shared/lib';
import { MobileFooter } from './MobileFooter';
import { LaptopFooter } from './LaptopFooter';

const MOBILE_QUERY = `(max-width: ${TABLET_BREAKPOINT}px)`;

/**
 * Адаптивный футер приложения.
 *
 * В зависимости от ширины экрана рендерит мобильную или десктопную версию.
 */
export const Footer = () => {
  const isMobile = useMediaQuery(MOBILE_QUERY);

  return isMobile ? <MobileFooter /> : <LaptopFooter />;
};