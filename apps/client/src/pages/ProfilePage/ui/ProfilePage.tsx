'use client';

import { Page } from '@/widgets/Layout';

import styles from './ProfilePage.module.scss';

export const ProfilePage = () => {
  return (
    <Page title="Профиль пользователя">
      <div className={styles.profileCard}>
        <p className={styles.placeholder}>
          Авторизация на клиенте отключена: профиль с сервера не загружается.
        </p>
      </div>
    </Page>
  );
};
