import { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant =
  | 'default' // Основной стиль (как в старом проекте)
  | 'red' // Красная кнопка
  | 'gray' // Серая кнопка
  | 'gradient' // Градиентная кнопка
  | 'transparent' // Прозрачная кнопка
  | 'purple' // Фиолетовая кнопка
  | 'outline'; // Контурная кнопка

export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Вариант стиля кнопки */
  variant?: ButtonVariant;
  /** Размер кнопки */
  size?: ButtonSize;
  /** Состояние загрузки */
  loading?: boolean;
  /** Иконка кнопки */
  icon?: ReactNode;
  /** Позиция иконки */
  iconPosition?: 'left' | 'right';
  /** Дополнительный CSS класс */
  className?: string;
  /** Обработчик клика */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
