import type { Profession } from "../models";
import type { TProfessionAdminItemResponse } from "@common/types";

/**
 * Преобразует ORM-модель профессии в admin-ответ (с id).
 */
export function mapProfessionToAdminItem(
  profession: Profession
): TProfessionAdminItemResponse {
  return {
    id: profession.id,
    name: profession.name,
  };
}
