import type { DescriptionProps } from '../../types';

import cn from 'classnames';
import { useState } from 'react';

import styles from './Description.module.scss';
import { QualityInfo } from '../QualityInfo';

/**
 * Блок описания фильма с возможностью раскрытия.
 */
export const Description = (props: DescriptionProps) => {
  const {
    film: { description, filmNameRu, filmNameEn },
  } = props;

  const [isExpanded, setIsExpanded] = useState(false);

  const filmName = filmNameRu ?? filmNameEn ?? '';

  const toggle = () => setIsExpanded((prev) => !prev);

  return (
    <section className={styles.root}>
      <p className={cn(styles.text, !isExpanded && styles.clamp)}>{description}</p>

      {!isExpanded && (
        <>
          <p className={styles.text}>Приглашаем посмотреть «{filmName}» в нашем кинотеатре</p>

          <button className={styles.link} onClick={toggle}>
            <span className={styles.mobile}>Читать</span>
            <span className={styles.desktop}>Подробнее</span>
          </button>
        </>
      )}

      {isExpanded && (
        <>
          <QualityInfo view="desktop" />

          <button className={styles.link} onClick={toggle}>
            Свернуть
          </button>
        </>
      )}
    </section>
  );
};
