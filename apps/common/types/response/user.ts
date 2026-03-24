import type { TUserEntity } from "../entity";

/** Краткий ответ API с публичными полями пользователя. */
export type TUserBriefResponse = Pick<TUserEntity, "id" | "email" | "name">;

/** Ответ API с полями пользователя из JWT-контекста. */
export type TUserTokenPayloadResponse = Pick<TUserEntity, "id" | "email">;
