import type { TCountryEntity } from "../entity";
import type { TFilmEntity } from "../entity";
import type { TGenreEntity } from "../entity";
import type { TPersonEntity } from "../entity";
import type { TProfessionEntity } from "../entity";

/** Роли приложения (ADR-005). */
export type TAppRole = "ADMIN" | "USER" | "MANAGER";

/** Частичное обновление, где `null` = «очистить поле» (PATCH админки, ADR-007). */
export type TNullablePartial<T> = { [K in keyof T]?: T[K] | null };

/** Параметры admin-списков: пагинация + поиск (`q` — films/persons). */
export type TAdminListRequest = {
  page?: number;
  perPage?: number;
  q?: string;
};

/** Скаляры фильма для админского CRUD; даты в JSON — строка ISO. */
export type TAdminFilmFields = Omit<TFilmEntity, "id" | "premiereWorldDate"> & {
  premiereWorldDate?: string;
};

/** Создание фильма (админка). */
export type TCreateFilmRequest = TAdminFilmFields;
/** Частичное обновление фильма; `null` — очистить опциональное поле. */
export type TUpdateFilmRequest = TNullablePartial<
  Omit<TAdminFilmFields, "filmNameRu">
> &
  Partial<Pick<TAdminFilmFields, "filmNameRu">>;

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
/** Обновление персоны; `photoUrl: null` — очистить фото. */
export type TUpdatePersonRequest = Partial<
  Pick<TPersonEntity, "nameRu" | "nameEn">
> &
  TNullablePartial<Pick<TPersonEntity, "photoUrl">> & {
    professionIds?: number[];
  };

/** Смена роли пользователя (одна активная роль). */
export type TUpdateUserRoleRequest = {
  role: TAppRole;
};

/** RPC: обновление фильма по id (админка). */
export type TAdminUpdateFilmRpcRequest = {
  id: number;
  data: TUpdateFilmRequest;
};

/** RPC: обновление жанра по id (админка). */
export type TAdminUpdateGenreRpcRequest = {
  id: number;
  data: TUpdateGenreRequest;
};

/** RPC: обновление страны по id (админка). */
export type TAdminUpdateCountryRpcRequest = {
  id: number;
  data: TUpdateCountryRequest;
};

/** RPC: обновление профессии по id (админка). */
export type TAdminUpdateProfessionRpcRequest = {
  id: number;
  data: TUpdateProfessionRequest;
};

/** RPC: обновление персоны по id (админка). */
export type TAdminUpdatePersonRpcRequest = {
  id: number;
  data: TUpdatePersonRequest;
};

/** RPC: смена роли пользователя по id (админка). */
export type TAdminSetUserRoleRpcRequest = {
  id: number;
  data: TUpdateUserRoleRequest;
};
