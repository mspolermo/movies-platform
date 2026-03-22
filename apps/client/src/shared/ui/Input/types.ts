import type { InputHTMLAttributes, ReactNode } from 'react';

export type InputVariant = 'default' | 'search' | 'email';
export type InputSize = 'small' | 'medium' | 'large';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Подпись поля */
  label?: string;
  /** Плейсхолдер */
  placeholder?: string;
  /** Сообщение об ошибке */
  error?: string;
  /** Обязательное поле */
  required?: boolean;
  /** Иконка */
  icon?: ReactNode;
  /** Позиция иконки */
  iconPosition?: 'left' | 'right';
  /** Возможность очистки поля */
  clearable?: boolean;
  /** Обработчик очистки */
  onClear?: () => void;
  /** Дополнительный CSS класс */
  className?: string;
  /** Вариант стиля */
  variant?: InputVariant;
  /** Размер поля */
  size?: InputSize;
}
