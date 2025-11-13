'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Layout } from '@/widgets/Layout';
import styles from './PersonDetailPage.module.scss';

export const PersonDetailPage: React.FC = () => {
  const params = useParams();

  return (
    <Layout>
      <div>Персона {params?.id}</div>
    </Layout>
  );
};
