import { useEffect, useRef, useState } from "react";

/**
 * Хук для управления анимированным dropdown меню.
 * Обрабатывает открытие, закрытие с задержкой (для анимации)
 * и состояние фона хедера.
*/
export const useAnimatedDropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isShowHeaderBackground, setIsShowHeaderBackground] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleDropdownOpen = () => {
    // Очищаем таймер закрытия если он есть
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsDropdownOpen(true);
    setIsClosing(false);
    setIsShowHeaderBackground(true); // Показываем фон хедера сразу
  };

  const handleDropdownClose = () => {
    if (!isClosing) {
      setIsClosing(true);
      setIsShowHeaderBackground(false); // Убираем фон хедера сразу
      // Удаляем элемент из DOM после завершения анимации
      timeoutRef.current = setTimeout(() => {
        setIsDropdownOpen(false);
        setIsClosing(false);
      }, 400); // Время анимации закрытия
    }
  };

  const handleDropdownMouseEnter = () => {
    // Отменяем закрытие при наведении на дропдаун
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsDropdownOpen(true);
    setIsClosing(false);
    setIsShowHeaderBackground(true); // Восстанавливаем фон хедера
  };

  // Очистка таймера при размонтировании
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    isDropdownOpen,
    isClosing,
    isShowHeaderBackground,
    onDropdownOpen: handleDropdownOpen,
    onDropdownClose: handleDropdownClose,
    onDropdownMouseEnter: handleDropdownMouseEnter
  }
}