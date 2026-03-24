import { TProfessionEntity } from "../entity";

/** Элемент ответа списка профессий. */
export type TProfessionItemResponse = Pick<TProfessionEntity, "id" | "name">;
