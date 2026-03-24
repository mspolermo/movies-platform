import type { TUserEntity } from "../entity";

/** Пользователь из JWT-контекста (req.user). */
export type TJwtUserRequest = Pick<TUserEntity, "id" | "email">;
