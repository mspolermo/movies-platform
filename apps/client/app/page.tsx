import { getHomeGenreCarousels, HomePage } from '@/pages/HomePage';

/**
 * Route Segment Config (Next читает export сам — не импортируется из кода).
 * Должен быть литералом: импорт константы Next static analysis не видит.
 * Держать в синхроне с `DEFAULT_REVALIDATE_SECONDS` (`shared/constants/cache`).
 * Данные каруселей дополнительно в Data Cache через `unstable_cache` в getHomeGenreCarousels.
 */
export const revalidate = 3600;

export default async function HomePageRoute() {
  const genreCarousels = await getHomeGenreCarousels();

  return <HomePage genreCarousels={genreCarousels} />;
}
