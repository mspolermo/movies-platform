import type { ReactNode } from 'react';

/** Пропсы секции с подгрузкой по кнопке «Показать ещё». */
export interface LoadMoreSectionProps {
  /** Основной контент (список и т.п.). */
  children: ReactNode;
  /** Обработчик догрузки следующей порции. */
  onLoadMore: () => void;
  /** Идёт запрос подгрузки — показывается индикатор загрузки. */
  isLoading: boolean;
  /** Есть ли ещё данные для подгрузки. */
  hasMore: boolean;
  /** Кастомный индикатор вместо дефолтного `Loader`. */
  loadingComponent?: ReactNode;
  /** Сообщение при отсутствии следующих страниц (например «Всё показано»). */
  endMessage?: ReactNode;
  /** CSS-класс обёртки. */
  className?: string;
}
