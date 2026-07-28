import type { TCountryEntity } from "../entity";
import type { TFilmEntity } from "../entity";
import type { TGenreEntity } from "../entity";
import type { TPersonEntity } from "../entity";
import type { TProfessionEntity } from "../entity";

//TODO: предположительные типы, создано во время разработки клиента на фейках, если что-то не так, то нужно исправить

/** Роли приложения (ADR-005). */
export type TAppRole = "ADMIN" | "USER" | "MANAGER";

/** Скаляры фильма для админского CRUD; даты в JSON — строка ISO. */
export type TAdminFilmFields = Omit<TFilmEntity, "id" | "premiereWorldDate"> & {
  premiereWorldDate?: string;
};

/** Создание фильма (админка). */
export type TCreateFilmRequest = TAdminFilmFields;
/** Частичное обновление фильма (админка). */
export type TUpdateFilmRequest = Partial<TAdminFilmFields>;

/** Создание жанра. */
export type TCreateGenreRequest = Pick<TGenreEntity, "nameRu" | "nameEn">;
/** Обновление жанра. */
export type TUpdateGenreRequest = Partial<TCreateGenreRequest>;

/** Создание страны. */
export type TCreateCountryRequest = Pick<
  TCountryEntity,
  "countryName" | "countryNameEn"
>;
/** Обновление страны. */
export type TUpdateCountryRequest = Partial<TCreateCountryRequest>;

/** Создание профессии. */
export type TCreateProfessionRequest = Pick<TProfessionEntity, "name">;
/** Обновление профессии. */
export type TUpdateProfessionRequest = Partial<TCreateProfessionRequest>;

/** Создание персоны + professionIds. */
export type TCreatePersonRequest = Pick<
  TPersonEntity,
  "nameRu" | "nameEn" | "photoUrl"
> & {
  professionIds: number[];
};
/** Обновление персоны. */
export type TUpdatePersonRequest = Partial<TCreatePersonRequest>;

/** Смена роли пользователя (одна активная роль). */
export type TUpdateUserRoleRequest = {
  role: TAppRole;
};
