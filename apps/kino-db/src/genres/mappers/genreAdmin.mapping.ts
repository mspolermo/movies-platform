import type { Genre } from "../models";
import type { TGenreAdminItemResponse } from "@common/types";

/**
 * Преобразует ORM-модель жанра в admin-ответ (с id).
 */
export function mapGenreToAdminItem(genre: Genre): TGenreAdminItemResponse {
  return {
    id: genre.id,
    nameRu: genre.nameRu,
    nameEn: genre.nameEn,
  };
}
