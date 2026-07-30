import type { TCountryEntity } from "../entity";
import type { TFilmEntity } from "../entity";
import type { TGenreEntity } from "../entity";
import type { TPersonEntity } from "../entity";
import type { TProfessionEntity } from "../entity";
import type { TPaginatedItemsResponse } from "../shared";
import type { TRoleResponse } from "./role";
import type { TAdminFilmFields } from "../request/admin";
import type { TAppRole } from "../request/admin";

/** Элемент списка/карточки фильма в админке (скаляры + id). */
export type TAdminFilmItemResponse = Pick<TFilmEntity, "id"> & TAdminFilmFields;

/** Жанр для админского CRUD (с id). */
export type TAdminGenreItemResponse = Pick<
  TGenreEntity,
  "id" | "nameRu" | "nameEn"
>;

/** Страна для админского CRUD (с id). */
export type TAdminCountryItemResponse = Pick<
  TCountryEntity,
  "id" | "countryName" | "countryNameEn"
>;

/** Профессия для админки (с id). */
export type TAdminProfessionItemResponse = Pick<
  TProfessionEntity,
  "id" | "name"
>;

/** Персона в админке: поля и professionIds для формы записи/чтения. */
export type TAdminPersonItemResponse = Pick<
  TPersonEntity,
  "id" | "photoUrl" | "nameRu" | "nameEn"
> & {
  professionIds: number[];
};

/** Пользователь в списке админки. */
export type TAdminUserItemResponse = {
  id: number;
  email: string;
  name?: string;
  roles: TRoleResponse[];
  /** Удобная основная роль для селекта (F1: одна роль). */
  role: TAppRole;
};

/** Пагинированный список фильмов (админка). */
export type TAdminFilmsListResponse =
  TPaginatedItemsResponse<TAdminFilmItemResponse>;

/** Пагинированный список жанров (админка). */
export type TAdminGenresListResponse =
  TPaginatedItemsResponse<TAdminGenreItemResponse>;

/** Пагинированный список стран (админка). */
export type TAdminCountriesListResponse =
  TPaginatedItemsResponse<TAdminCountryItemResponse>;

/** Пагинированный список профессий (админка). */
export type TAdminProfessionsListResponse =
  TPaginatedItemsResponse<TAdminProfessionItemResponse>;

/** Пагинированный список персон (админка). */
export type TAdminPersonsListResponse =
  TPaginatedItemsResponse<TAdminPersonItemResponse>;

/** Пагинированный список пользователей (админка). */
export type TAdminUsersListResponse =
  TPaginatedItemsResponse<TAdminUserItemResponse>;
