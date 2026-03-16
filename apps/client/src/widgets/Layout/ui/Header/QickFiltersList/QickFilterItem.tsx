import { TQickFilterItem } from "../../../models";
import styles from './styles/QickFilterItem.module.scss';

export const QickFilterItem = ({label, onClick}: TQickFilterItem) => {
  return (
    <button
      className={styles.item}
      onClick={onClick}
    >
      {label}
    </button>
  )
}