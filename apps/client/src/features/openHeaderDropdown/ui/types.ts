import { ReactElement, ReactNode } from "react";

type TDropdownActionsProps = {
  /** Открыть dropdown */
  onOpen: () => void;

  /** Закрыть dropdown */
  onClose: () => void;

  /** Текущее состояние dropdown */
  isOpen: boolean;
}

export type TDropdownProps = {
  /**
   * Render-prop триггера (обычно кнопка или ссылка).
   * Позволяет контролировать открытие dropdown извне.
   */
  trigger: (props: TDropdownActionsProps) => ReactNode;

  /**
   * Контент dropdown. С передачей пропов контроллирования состояния dropdown
   */
  content: (props: TDropdownActionsProps) => ReactNode;

  /**
   * Колбэк, вызывается при изменении состояния открытия dropdown.
   */
  onOpenChange?: (isOpen: boolean) => void;
}