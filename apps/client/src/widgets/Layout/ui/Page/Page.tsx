'use client';

import type { TPageProps } from '../types';

import { BackButton } from '@/features/navigateBack';

import styles from '../Layout/Layout.module.scss';

/**
 * Заголовок страницы и кнопка «назад» внутри main (используется в страницах, не в app/layout).
 */
export const Page = ({ children, title, withBackButton }: TPageProps) => (
  <>
    {withBackButton && <BackButton />}
    {title && <h1 className={styles.title}>{title}</h1>}
    {children}
  </>
);
