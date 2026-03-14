import { TDropdownItem } from "../../../models";
import styles from './styles/DropdownItem.module.scss';

export const DropdownItem = ({label, onClick}: TDropdownItem) => {
  return (
    <button
      className={styles.item}
      onClick={onClick}
    >
      {label}
    </button>
  )
}