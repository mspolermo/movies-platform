import { useEffect, useRef, useState } from "react";

/**
 * Хук для управления открытием dropdown меню.
*/
export const useAnimatedDropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isInDropdown, setIsInDropdown] = useState(false);

  const handleDropdownOpen = () => {
    setIsDropdownOpen(true)
  };

  const handleDropdownClose = () => {
    if(!isInDropdown) setIsDropdownOpen(false)
  };

  return {
    isDropdownOpen,
    onDropdownOpen: handleDropdownOpen,
    onDropdownClose: handleDropdownClose,
  }
}