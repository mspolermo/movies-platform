import type { TRoleEntity } from "../entity";

/** Элемент ответа API со сведениями о роли. */
export type TRoleResponse = Pick<TRoleEntity, "id" | "value" | "description">;
