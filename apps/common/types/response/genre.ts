import type { TGenreEntity } from "../entity";

/** Элемент ответа списка жанров для клиентских списков и фильтров. */
export type TGenreItemResponse = Pick<TGenreEntity, "nameRu" | "nameEn">;
