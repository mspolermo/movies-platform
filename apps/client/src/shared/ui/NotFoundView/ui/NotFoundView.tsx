import type { TNotFoundViewProps } from '../model';

import styles from './NotFoundView.module.scss';

const DEFAULT_DESCRIPTION = 'К сожалению, по вашему запросу ничего не найдено';

/** Презентационный 404: цифра и описание (без оболочки Page). */
export const NotFoundView = ({
  description = DEFAULT_DESCRIPTION,
  title = '404',
}: TNotFoundViewProps) => (
  <div className={styles.container}>
    <h1 className={styles.title}>{title}</h1>
    <p className={styles.description}>{description}</p>
  </div>
);
