import { getHomeGenreCarousels, HomePage } from '@/pages/HomePage';

/** ISR: набор каруселей кэшируется в getHomeGenreCarousels (unstable_cache). */
export const revalidate = 3600;

export default async function HomePageRoute() {
  const genreCarousels = await getHomeGenreCarousels();

  return <HomePage genreCarousels={genreCarousels} />;
}
