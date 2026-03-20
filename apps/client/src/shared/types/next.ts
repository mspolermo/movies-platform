/**
 * Тип пропсов страницы в Next (App Router)
 */
export type TPageProps<
  TParams extends Record<string, string> = {},
  TSearchParams extends Record<
    string,
    string | string[] | undefined
  > = {}
> = {
  params: TParams;
  searchParams: TSearchParams;
};