import React from 'react';
import { useRouter } from 'next/navigation';
import { SvgIcon } from '@/shared/ui/SvgIcon';
import styles from './SearchResultItem.module.scss';

interface SearchResultItemProps {
  id: number;
  title: string;
  subtitle?: string;
  iconName: 'tv' | 'person';
  type: 'films' | 'persons';
  onClick?: () => void;
}

export const SearchResultItem: React.FC<SearchResultItemProps> = ({
  id,
  title,
  subtitle,
  iconName,
  type,
  onClick,
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    }

    if (type === 'films') {
      router.push(`/films/${id}`);
    } else {
      router.push(`/persons/${id}`);
    }
  };

  return (
    <div className={styles.result} onClick={handleClick}>
      <div className={styles.content}>
        <div className={styles.icon}>
          <SvgIcon name={iconName} size={20} />
        </div>
        <div className={styles.info}>
          <div className={styles.title}>{title}</div>
          {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
        </div>
      </div>
    </div>
  );
};

