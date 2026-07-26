# SvgIcon

Единый способ показать UI-иконку в клиенте.

## Хранение

1. Чистый SVG в [`assets/`](./assets/) — файл `<camelCaseKey>.svg`, только `currentColor` (без hex).
2. Зарегистрировать ключ **camelCase** в [`constants/IconsLibrary.ts`](./constants/IconsLibrary.ts): `import Icon from '../assets/key.svg'`.

Снаружи слайса `.svg` не импортировать (eslint разрешает SVG-импорты только внутри `shared/ui/SvgIcon`). Не класть иконки в `shared/assets`.

## Использование

```tsx
import { SvgIcon } from '@/shared/ui';

<SvgIcon icon="search" size={20} />
<SvgIcon icon="backArrow" className={styles.icon} />
```

Цвет — CSS-классы + токены из `app/styles/colors.scss`:

```scss
.icon {
  color: var(--color-text);
}
```

## Не делать

- Не класть `.tsx` в `assets/` — только `.svg`.
- Не передавать React-компонент в `icon` — только ключ из registry.
- Не использовать kebab-case ключи (`back-arrow` → `backArrow`).
- Не задавать `color` / `fill` / `stroke` пропсами SvgIcon.
- Не вешать `onClick` на SvgIcon — на `<button>` / `<a>`.
- Не путать с `Button` `icon?: ReactNode` (`icon={<SvgIcon icon="filters" />}` — ок).
