import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/styles/globals.scss';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Movies Platform',
  description: 'Платформа для просмотра информации о фильмах',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
