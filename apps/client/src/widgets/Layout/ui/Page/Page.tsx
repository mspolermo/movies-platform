'use client';

import type { TPageProps } from '../types';

import cn from 'classnames';

import { BackButton } from '@/features/navigateBack';
import { Breadcrumbs } from '@/shared/ui';

import styles from './Page.module.scss';

/**
 * Заголовок страницы, крошки и кнопка «назад» внутри main (используется в страницах, не в app/layout).
 */
export const Page = ({
  children,
  title,
  onlyLaptopTitle,
  withBackButton,
  breadcrumbs,
}: TPageProps) => (
  <>
    {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} />}
    {withBackButton && <BackButton />}
    {title && (
      <h1 className={cn(styles.title, onlyLaptopTitle && styles.title_onlyLaptop)}>{title}</h1>
    )}
    {children}
  </>
);
