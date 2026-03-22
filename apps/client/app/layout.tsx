import type { Metadata } from 'next';

import type { ReactNode } from 'react';

import { Inter } from 'next/font/google';

import '@/app/styles/globals.scss';

import { AuthInitializer } from '@/features/auth';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Movies Platform',
  description: 'Платформа для просмотра информации о фильмах',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <AuthInitializer />
        {children}
      </body>
    </html>
  );
}
