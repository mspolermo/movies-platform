import type { TFilmCardResponse } from "./film";
import type { TPersonListItemResponse } from "./person";

/** Ответ API для поиска. */
export interface TSearchResultResponse {
  films: TFilmCardResponse[];
  persons: TPersonListItemResponse[];
}
