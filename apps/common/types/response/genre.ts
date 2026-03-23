import type { TGenreEntity } from "../genre";

/** Элемент ответа списка жанров для клиентских списков и фильтров. */
export type TGenreListItemResponse = Pick<TGenreEntity, "nameRu" | "nameEn">;

/** Ответ API для списка жанров. */
export type TGenreListResponse = TGenreListItemResponse[];