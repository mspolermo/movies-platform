import type { TProfessionCardProps } from './types';

import Link from 'next/link';

import { FilterCardButton } from '@/shared/ui';

import styles from './ProfessionCard.module.scss';

/**
 * Карточка профессии.
 */
export const ProfessionCard = ({ profession }: TProfessionCardProps) => {
  const { name } = profession;

  return (
    <Link href={`/professions?profession=${name}`}>
      <FilterCardButton ariaLabel={`Открыть список ${name}`} className={styles.wrapper}>
        <h3 className={styles.name}>{name}</h3>
      </FilterCardButton>
    </Link>
  );
};
