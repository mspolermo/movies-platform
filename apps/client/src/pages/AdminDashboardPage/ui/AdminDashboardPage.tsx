'use client';

import Link from 'next/link';

import { ADMIN_NAV_ITEMS } from '@/entities/user';
import { Page } from '@/widgets/Layout';

import styles from './AdminDashboardPage.module.scss';

/** Обзор `/admin`: ссылки на разделы. */
export const AdminDashboardPage = () => (
  <Page title="Обзор" titleAlign="start">
    <p className={styles.lead}>
      Бэк-офис (заглушка). Данные локальные; HTTP к gateway не отправляется (ADR-005).
    </p>
    <ul className={styles.list}>
      {ADMIN_NAV_ITEMS.filter((item) => item.href !== '/admin').map((item) => (
        <li key={item.href}>
          <Link className={styles.link} href={item.href}>
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  </Page>
);
