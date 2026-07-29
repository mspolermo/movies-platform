import type { TAdminListRequest } from "@common/types";

/** Нормализованные параметры admin-списка (пагинация + поиск). */
export type TAdminListParams = {
  page: number;
  perPage: number;
  offset: number;
  q?: string;
};

/** Дефолты и границы пагинации admin-списков (ADR-007): page ≥ 1, perPage 1–100 (default 50). */
export function toAdminListParams(
  request: TAdminListRequest
): TAdminListParams {
  const page = Math.max(1, Math.trunc(request.page ?? 1));
  const perPage = Math.min(100, Math.max(1, Math.trunc(request.perPage ?? 50)));
  const q = request.q?.trim() || undefined;

  return { page, perPage, offset: (page - 1) * perPage, q };
}
