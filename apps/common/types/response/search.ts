import type { TFilmListItemResponse } from "./film";
import type { TPersonListItemResponse } from "./person";

/** Ответ API для поиска. */
export type TSearchResultResponse = {
  films: TFilmListItemResponse[];
  persons: TPersonListItemResponse[];
};
