import React, { useEffect, useState } from 'react';
import styles from './FactBlock.module.scss';
import { TFactBased } from '@common/types';
import { FactBlockProps } from '../../types';


export const FactBlock = ({ fact, isCartoon }: FactBlockProps) => {
  if (!fact || !fact.value) {
    return null;
  }

  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpanded = () => setIsExpanded(!isExpanded);

  return (
    <div className={styles.factBlock}>
      <h3 
        className={`${styles.title} ${styles.titleClickable}`}
        onClick={toggleExpanded}
      >
        {`Факт о ${isCartoon ? 'мультфильме' : 'фильме'}`}
      </h3>
      {isExpanded && (
        <>
          <p className={`${styles.text} ${!isExpanded ? styles.short : ''}`}>
            {fact.value}
          </p>
          <p className={`${styles.text} ${!isExpanded ? styles.short : ''}`}>
            {fact.spoiler}
          </p>
        </>
      )}
    </div>
  );
};


