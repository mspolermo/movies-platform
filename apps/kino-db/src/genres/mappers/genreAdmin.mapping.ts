import type { Genre } from "../models";
import type { TAdminGenreItemResponse } from "@common/types";

/**
 * Преобразует ORM-модель жанра в admin-ответ (с id).
 */
export function mapGenreToAdminItem(genre: Genre): TAdminGenreItemResponse {
  return {
    id: genre.id,
    nameRu: genre.nameRu,
    nameEn: genre.nameEn,
  };
}
