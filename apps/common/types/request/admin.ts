import type { TCountryEntity } from "../entity";
import type { TFilmEntity } from "../entity";
import type { TGenreEntity } from "../entity";
import type { TPersonEntity } from "../entity";
import type { TProfessionEntity } from "../entity";

import { TNullablePartial } from "../shared";

/** Роли приложения (ADR-005). */
export type TAppRole = "ADMIN" | "USER" | "MANAGER";

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

/** RPC: обновление данных по id (админка). */
type TAdminUpdateRpcRequest<T> = {
  id: number;
  data: T;
};

/** RPC: обновление фильма по id (админка). */
export type TAdminUpdateFilmRpcRequest = TAdminUpdateRpcRequest<TUpdateFilmRequest>;

/** RPC: обновление жанра по id (админка). */
export type TAdminUpdateGenreRpcRequest = TAdminUpdateRpcRequest<TUpdateGenreRequest>;

/** RPC: обновление страны по id (админка). */
export type TAdminUpdateCountryRpcRequest = TAdminUpdateRpcRequest<TUpdateCountryRequest>;

/** RPC: обновление профессии по id (админка). */
export type TAdminUpdateProfessionRpcRequest = TAdminUpdateRpcRequest<TUpdateProfessionRequest>;

/** RPC: обновление персоны по id (админка). */
export type TAdminUpdatePersonRpcRequest = TAdminUpdateRpcRequest<TUpdatePersonRequest>

/** RPC: смена роли пользователя по id (админка). */
export type TAdminSetUserRoleRpcRequest = TAdminUpdateRpcRequest<TUpdateUserRoleRequest>;
