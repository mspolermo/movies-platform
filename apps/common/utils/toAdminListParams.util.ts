import type { TAdminListRequest, TListParams } from "@common/types";

import {
  LIST_DEFAULT_LIMIT,
  LIST_MAX_LIMIT,
} from "@common/constants";

export function toAdminListParams(
  request: TAdminListRequest
): TListParams {
  const page = Math.max(1, Math.trunc(request.page ?? 1));
  const perPage = Math.min(
    LIST_MAX_LIMIT,
    Math.max(1, Math.trunc(request.perPage ?? LIST_DEFAULT_LIMIT))
  );
  const q = request.q?.trim() || undefined;

  return { page, perPage, offset: (page - 1) * perPage, q };
}
