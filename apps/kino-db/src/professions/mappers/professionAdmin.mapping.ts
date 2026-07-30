import type { Profession } from "../models";
import type { TAdminProfessionItemResponse } from "@common/types";

/**
 * Преобразует ORM-модель профессии в admin-ответ (с id).
 */
export function mapProfessionToAdminItem(
  profession: Profession
): TAdminProfessionItemResponse {
  return {
    id: profession.id,
    name: profession.name,
  };
}
