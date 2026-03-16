import { ReactElement, ReactNode } from "react";

type TTriggerProps = {
  /** Открыть dropdown */
  onOpen: () => void;

  /** Закрыть dropdown */
  onClose: () => void;

  /** Текущее состояние dropdown */
  isOpen: boolean;
}

type TDropdownChildProps = {
  /** Функция для закрытия dropdown (прокидывается в children) */
  onClose: () => void;
}

export type TDropdownProps = {
  /**
   * Render-prop триггера (обычно кнопка или ссылка).
   * Позволяет контролировать открытие dropdown извне.
   */
  trigger: (props: TTriggerProps) => ReactNode;

  /**
   * Контент dropdown.
   * Внутрь автоматически инжектится `onClose`.
   */
  children: ReactElement<TDropdownChildProps>;

  /**
   * Колбэк, вызывается при изменении состояния открытия dropdown.
   */
  onOpenChange?: (isOpen: boolean) => void;
}