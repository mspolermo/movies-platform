/** Query-параметры страницы Next.js App Router. */
export type TSearchParams = Record<
  string,
  string | string[] | undefined
>;

/**
 * Тип пропсов страницы в Next (App Router)
 */
export type TPageProps<
  TParams extends Record<string, string> = Record<string, never>,
  TQuery extends TSearchParams = Record<string, never>,
> = {
  params: TParams;
  searchParams: TQuery;
};
