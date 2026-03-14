/**
 * Навигационные ссылки футера для десктопной версии (laptop layout).
 * Используются в колонке "Разделы".
 */
export const LAPTOP_SECTIONS = [
  { label: 'Фильмы', url: '/films' },
  { label: 'Жанры', url: '/genres' },
  { label: 'Страны', url: '/countries' },
  { label: 'Персоны', url: '/persons' },
  { label: 'Профессии', url: '/professions' },
];

/**
 * Элементы нижней панели навигации мобильного футера.
 * Содержат текст, иконку из SvgIcon и URL перехода.
 */
export const MOBILE_SECTIONS = [
  { label: 'MovieLand', icon: 'home', url: '/' },
  { label: 'Каталог', icon: 'devices', url: '/films'},
  { label: 'Поиск', icon: 'search', url: '/search'},
  { label: 'Жанры', icon: 'tv', url: '/genres'},
  { label: 'Страны', icon: 'dots-horizontal', url: '/countries'},
];