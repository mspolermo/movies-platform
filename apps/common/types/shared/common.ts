/** Частичное обновление, где `null` = «очистить поле» (PATCH админки, ADR-007). */
export type TNullablePartial<T> = { [K in keyof T]?: T[K] | null };
