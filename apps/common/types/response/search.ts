import type { TFilmListItemResponse } from "./film";
import type { TPersonListItemResponse } from "./person";

/** Ответ API для поиска. */
export interface TSearchResultResponse {
  films: TFilmListItemResponse[];
  persons: TPersonListItemResponse[];
}
