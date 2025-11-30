'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/api/authStore/store';
import { Layout } from '@/widgets/Layout';
import styles from './HomePage.module.scss';

export const HomePage = () => {
  return (
    <Layout>
      <div className={styles.container}>
        <h1>MainPage</h1>
      </div>
    </Layout>
  );
};
