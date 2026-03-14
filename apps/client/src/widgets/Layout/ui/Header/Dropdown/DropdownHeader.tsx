import { TDropdownHeading } from "../../../models";
import styles from './styles/DropdownHeader.module.scss';

export const DropdownHeader = ({label}: TDropdownHeading) => (
  <h3 key={`heading-${label}`} className={styles.heading}>
    {label}
  </h3>
)