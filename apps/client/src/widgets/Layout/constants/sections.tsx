/**
 * Навигационные ссылки хедера для десктопной версии.
 */
export const HEADER_SECTIONS_LAPTOP = [
  { label: 'Фильмы', url: '/films', content: 'qickFiltersList' },
  { label: 'Разделы', url: 'professions', content: 'chaptersSection'  },
  { label: 'Debug', url: '/debug' },
]

/**
 * Навигационные ссылки футера для десктопной версии.
 * Используются в колонке "Разделы".
 */
export const FOOTER_SECTIONS_LAPTOP = [
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
export const FOOTER_SECTIONS_MOBILE = [
  { label: 'MovieLand', icon: 'home', url: '/' },
  { label: 'Каталог', icon: 'devices', url: '/films'},
  { label: 'Поиск', icon: 'search', url: '/search'},
  { label: 'Жанры', icon: 'tv', url: '/genres'},
  { label: 'Страны', icon: 'dots-horizontal', url: '/countries'},
];
