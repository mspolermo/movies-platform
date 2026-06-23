import type { Genre } from "../models";
import type { TGenreItemResponse } from "@common/types";

/**
 * Преобразует ORM-модель жанра в DTO ответа.
 */
export function mapGenreToItem(
  genre: Genre
): TGenreItemResponse {
  return {
    nameRu: genre.nameRu,
    nameEn: genre.nameEn,
  };
}