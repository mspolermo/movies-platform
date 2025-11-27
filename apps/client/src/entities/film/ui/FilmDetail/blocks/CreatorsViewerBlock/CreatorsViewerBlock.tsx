import { useState } from "react";
import { TCreatorsViewerBlockProps } from "../../types";
import styles from './CreatorsViewerBlock.module.scss';

export const CreatorsViewerBlock = ({creatorsViewer}: TCreatorsViewerBlockProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className={styles.cardsBlock}>
      <h3
        className={`${styles.title} ${styles.titleClickable}`}
        onClick={toggleExpanded}
      >
        {isExpanded ? 'Скрыть создателей и актёров' : 'Смотреть создателей и актёров'}
      </h3>
      {isExpanded && creatorsViewer}
    </div>
  )
}