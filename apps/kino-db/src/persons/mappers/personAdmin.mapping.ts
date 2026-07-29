import type { Person } from "../models";
import type { TPersonAdminItemResponse } from "@common/types";

/**
 * Преобразует ORM-модель персоны в admin-ответ (поля + professionIds).
 * Требует загруженной связи `professions`.
 */
export function mapPersonToAdminItem(person: Person): TPersonAdminItemResponse {
  return {
    id: person.id,
    photoUrl: person.photoUrl ?? "",
    nameRu: person.nameRu,
    nameEn: person.nameEn,
    professionIds: (person.professions ?? []).map(
      (profession) => profession.id
    ),
  };
}
