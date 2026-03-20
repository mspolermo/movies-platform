

import { FilterCardButton, Loader } from "@/shared/ui";
import { TProfessionCardProps } from "./types";
import styles from './ProfessionCard.module.scss';
import Link from "next/link";

/**
 * Карточка профессии.
 */
export const ProfessionCard = ({ profession }: TProfessionCardProps) => {
const { name } = profession;

  return (
    <Link href={`/professions?profession=${name}`}>
      <FilterCardButton
        ariaLabel={`Открыть список ${name}`}
        className={styles.wrapper}
      >
        <h3 className={styles.name}>{name}</h3>
      </FilterCardButton>
    </Link>
  )
}