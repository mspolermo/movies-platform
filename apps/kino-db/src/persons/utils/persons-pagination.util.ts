import { LIST_DEFAULT_LIMIT, LIST_MAX_LIMIT } from "@common/constants";

/**
 * Нормализует page/limit для пагинированных списков персон.
 * При невалидных значениях подставляет безопасные дефолты.
 */
export function normalizePersonListPagination(
  page: number = 1,
  limit: number = LIST_DEFAULT_LIMIT
): { page: number; limit: number; offset: number } {
  const normalizedLimit =
    limit > 0 && limit <= LIST_MAX_LIMIT
      ? limit
      : LIST_DEFAULT_LIMIT;
  const normalizedPage = page > 0 ? page : 1;
  const normalizedOffset = (normalizedPage - 1) * normalizedLimit;
  return {
    page: normalizedPage,
    limit: normalizedLimit,
    offset: normalizedOffset,
  };
}
