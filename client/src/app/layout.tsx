import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Платформа фильмов',
  description: 'Информация о фильмах, людях, жанрах и странах',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}
