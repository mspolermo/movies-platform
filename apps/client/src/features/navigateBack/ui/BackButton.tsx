'use client';

import { useRouter } from 'next/navigation';

import { BackArrowIcon } from '@/shared/assets';
import { SvgIcon } from '@/shared/ui';

import styles from './BackButton.module.scss';

export const BackButton = () => {
  const router = useRouter();

  const handleBackClick = () => {
    router.back();
  };

  return (
    <button
      aria-label="Вернуться назад"
      className={styles.backButton}
      type="button"
      onClick={handleBackClick}
    >
      <SvgIcon className={styles.backIcon} icon={BackArrowIcon} size={40} />
      <span className={styles.backText}>Назад</span>
    </button>
  );
};
