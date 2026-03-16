import { TQickFilterHeading } from "../../../models";
import styles from './styles/QickFilterHeader.module.scss';

export const QickFilterHeader = ({label}: TQickFilterHeading) => (
  <h3 key={`heading-${label}`} className={styles.heading}>
    {label}
  </h3>
)