/** Режим create | edit и необязательный filmId. */
export type TAdminFilmFormPageProps = {
  mode: 'create' | 'edit';
  filmId?: number;
};
