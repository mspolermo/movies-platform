/** Пункт бокового меню админки. */
export type TAdminNavItem = {
  label: string;
  href: string;
};

/** Разделы sidebar `/admin/*`. */
export const ADMIN_NAV_ITEMS: TAdminNavItem[] = [
  { label: 'Обзор', href: '/admin' },
  { label: 'Фильмы', href: '/admin/films' },
  { label: 'Жанры', href: '/admin/genres' },
  { label: 'Страны', href: '/admin/countries' },
  { label: 'Профессии', href: '/admin/professions' },
  { label: 'Персоны', href: '/admin/persons' },
  { label: 'Пользователи', href: '/admin/users' },
];
