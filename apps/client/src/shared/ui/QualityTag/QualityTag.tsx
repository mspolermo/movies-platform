import React from 'react';
import styles from './QualityTag.module.scss';

interface QualityTagProps {
  quality: 'FullHD' | 'HD' | '1080' | '720';
}

export const QualityTag: React.FC<QualityTagProps> = ({ quality }) => {
  return <p className={styles.icon}>{quality}</p>;
};
