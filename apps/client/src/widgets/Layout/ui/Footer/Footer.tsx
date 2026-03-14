'use client';

import { TABLET_BREAKPOINT } from '@/shared/constants';
import { useMediaQuery } from '@/shared/lib';
import dynamic from 'next/dynamic';

const MOBILE_QUERY = `(max-width: ${TABLET_BREAKPOINT}px)`;

const MobileFooter = dynamic(() => import('./MobileFooter').then(m => m.MobileFooter), { ssr: false });
const LaptopFooter = dynamic(() => import('./LaptopFooter').then(m => m.LaptopFooter), { ssr: false });

/**
 * Адаптивный футер приложения.
 *
 * В зависимости от ширины экрана рендерит мобильную или десктопную версию.
 */
export const Footer = () => {
  const isMobile = useMediaQuery(MOBILE_QUERY);

  return isMobile ? <MobileFooter /> : <LaptopFooter />;
};