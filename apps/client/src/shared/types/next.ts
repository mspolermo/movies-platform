/**
 * Тип пропсов страницы в Next (App Router)
 */
export type TPageProps<
  TParams extends Record<string, string> = Record<string, never>,
  TSearchParams extends Record<string, string | string[] | undefined> = Record<
    string,
    never
  >,
> = {
  params: TParams;
  searchParams: TSearchParams;
};
