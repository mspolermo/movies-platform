import type { TAdminFilmItemResponse } from '@common/types';

export type TAdminFilmFormProps = {
  mode: 'create' | 'edit';
  initial?: TAdminFilmItemResponse;
};
