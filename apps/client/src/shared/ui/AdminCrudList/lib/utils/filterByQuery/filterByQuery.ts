/** Клиентский фильтр списка по нормализованному поисковому запросу. */
export const filterByQuery = <T>(
  items: T[],
  query: string,
  match: (item: T, normalizedQuery: string) => boolean
): T[] => {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return items;
  }

  return items.filter((item) => match(item, normalizedQuery));
};
