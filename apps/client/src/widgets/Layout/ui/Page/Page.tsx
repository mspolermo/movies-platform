'use client';

import type { TPageProps } from '../types';

import cn from 'classnames';

import { BackButton } from '@/features/navigateBack';

import styles from './Page.module.scss';

/**
 * Заголовок страницы и кнопка «назад» внутри main (используется в страницах, не в app/layout).
 */
export const Page = ({ children, title, onlyLaptopTitle, withBackButton }: TPageProps) => (
  <>
    {withBackButton && <BackButton />}
    {title && (
      <h1 className={cn(styles.title, onlyLaptopTitle && styles.title_onlyLaptop)}>{title}</h1>
    )}
    {children}
  </>
);
