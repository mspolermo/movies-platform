import type { TSvgIconName } from '../constants';

export type { TSvgIconName };

/**
 * Пропсы обёртки SvgIcon.
 * Цвет задаётся через `className` + CSS-токены (`currentColor`), не через TSX.
 */
export type TSvgIconProps = {
  /** Ключ иконки из IconsLibrary (camelCase). */
  icon: TSvgIconName;
  /** Размер бокса; number → px. */
  size?: number | string;
  className?: string;
  /** Если задан — иконка смысловая (`role="img"`). */
  'aria-label'?: string;
  /** Явный override; по умолчанию `true`, если нет `aria-label`. */
  'aria-hidden'?: boolean | 'true' | 'false';
};
