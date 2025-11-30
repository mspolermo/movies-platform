'use client';

import { SvgIcon } from '@/shared/ui';
import { BackArrowIcon } from '@/shared/assets/svg-icons';
import styles from './BackButton.module.scss';
import { useRouter } from 'next/navigation';

export const BackButton = () => {
  const router = useRouter();
  
  const handleBackClick = () => {
    router.back();
  };

  return (
    <button
    type="button"
    className={styles.backButton}
    onClick={handleBackClick}
    aria-label="Вернуться назад"
  >
    <SvgIcon
      icon={BackArrowIcon}
      size={40}
      className={styles.backIcon}
    />
    <span className={styles.backText}>Назад</span>
  </button>
  )
}