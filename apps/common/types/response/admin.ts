import type { TCountryEntity } from "../entity";
import type { TFilmEntity } from "../entity";
import type { TGenreEntity } from "../entity";
import type { TPersonEntity } from "../entity";
import type { TProfessionEntity } from "../entity";
import type { TRoleResponse } from "./role";
import type { TAdminFilmFields } from "../request/admin";
import type { TAppRole } from "../request/admin";

//TODO: предположительные типы, создано во время разработки клиента на фейках, если что-то не так, то нужно исправить

/** Элемент списка/карточки фильма в админке (скаляры + id). */
export type TAdminFilmItemResponse = Pick<TFilmEntity, "id"> & TAdminFilmFields;

/** Жанр для админского CRUD (с id). */
export type TGenreAdminItemResponse = Pick<
  TGenreEntity,
  "id" | "nameRu" | "nameEn"
>;

/** Страна для админского CRUD (с id). */
export type TCountryAdminItemResponse = Pick<
  TCountryEntity,
  "id" | "countryName" | "countryNameEn"
>;

/** Профессия для админки (алиас публичного элемента с id). */
export type TProfessionAdminItemResponse = Pick<TProfessionEntity, "id" | "name">;

/** Персона в админке: поля и professionIds для формы записи/чтения. */
export type TPersonAdminItemResponse = Pick<
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
