import type { TAdminNavItem } from '../model';

/** Разделы `/admin/*` (сайдбар и выпадающее меню шапки). */
export const ADMIN_NAV_ITEMS: TAdminNavItem[] = [
  { label: 'Обзор', href: '/admin' },
  { label: 'Фильмы', href: '/admin/films' },
  { label: 'Жанры', href: '/admin/genres' },
  { label: 'Страны', href: '/admin/countries' },
  { label: 'Профессии', href: '/admin/professions' },
  { label: 'Персоны', href: '/admin/persons' },
  { label: 'Пользователи', href: '/admin/users' },
];
