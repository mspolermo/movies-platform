'use client';

import styles from './styles/QickFiltersList.module.scss';
import { QickFilterHeader } from './QickFilterHeader';
import { QickFilterItem } from './QickFilterItem';
import { useQuickFiltersList } from '../../../lib';

export const QickFiltersList = ({onClose}: {onClose: () => void;}) => {
  const items = useQuickFiltersList(onClose);

  return (
    <div className={styles.grid}>
    {items.map((item) =>
      item.type === 'heading' ? (
        <QickFilterHeader key={`heading-${item.label}`} {...item} />
      ) : (
        <QickFilterItem
          {...item} 
          key={`${item.label}-${item.key}`}
        />
      )
    )}
  </div>
  );
};