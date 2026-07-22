import type { Person } from "../../persons";
import type { TProfessionItemResponse } from "@common/types";

/**
 * Уникальные профессии из списка персон фильма (порядок первого появления).
 */
export function collectUniqueProfessions(
  persons: Person[]
): TProfessionItemResponse[] {
  const professionsMap = new Map<number, TProfessionItemResponse>();

  for (const person of persons) {
    for (const profession of person.professions ?? []) {
      if (!professionsMap.has(profession.id)) {
        professionsMap.set(profession.id, {
          id: profession.id,
          name: profession.name,
        });
      }
    }
  }

  return [...professionsMap.values()];
}
