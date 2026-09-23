import type { TListPaginationParams, TListParams } from "@common/types";

import { LIST_DEFAULT_LIMIT, LIST_MAX_LIMIT } from "@common/constants";

/** Нормализация пагинации (default LIST_DEFAULT_LIMIT, cap LIST_MAX_LIMIT). */
export function toListParams(request: TListPaginationParams): TListParams {
  const page = Math.max(1, Math.trunc(request.page ?? 1));
  const perPage = Math.min(
    LIST_MAX_LIMIT,
    Math.max(1, Math.trunc(request.perPage ?? LIST_DEFAULT_LIMIT))
  );

  return { page, perPage, offset: (page - 1) * perPage };
}
