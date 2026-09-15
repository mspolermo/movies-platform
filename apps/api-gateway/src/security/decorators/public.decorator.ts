import { SetMetadata } from "@nestjs/common";

/** Ключ метаданных для обозначения публичных endpoint. */
export const IS_PUBLIC_KEY = "isPublic";

/** Помечает endpoint как публичный, без обязательной JWT-аутентификации. */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);