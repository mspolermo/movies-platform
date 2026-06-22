import type { Profession } from "../models";
import type { TProfessionItemResponse } from "@common/types";

/**
 * Преобразует ORM-модель профессии в DTO ответа.
 */
export function mapProfessionToItem(
  profession: Profession
): TProfessionItemResponse {
  return {
    id: profession.id,
    name: profession.name,
  };
}