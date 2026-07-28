import type { TAdminFilmItemResponse } from '@common/types';

/** Режим и начальные данные формы фильма. */
export type TAdminFilmFormProps = {
  mode: 'create' | 'edit';
  initial?: TAdminFilmItemResponse;
};
