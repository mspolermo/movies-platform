'use client';

import styles from './QickFiltersList.module.scss';
import { useQuickFiltersList } from '../../../../lib';

export const QickFiltersList = ({onClose}: {onClose: () => void;}) => {
  const items = useQuickFiltersList(onClose);

  return (
    <div className={styles.grid}>
    {items.map((item) =>
      item.type === 'heading' ? (
        <h3 key={`heading-${item.label}`} className={styles.heading}>
          {item.label}
        </h3>
      ) : (
        <button
        key={`${item.label}-${item.key}`}
        className={styles.item}
        onClick={item.onClick}
      >
        {item.label}
      </button>
      )
    )}
  </div>
  );
};