'use client';

import type { ExpandableBlockProps } from './types';

import cn from 'classnames';
import { useState } from 'react';

import styles from './ExpandableBlock.module.scss';

/**
 * Универсальный раскрывающийся блок с вариациями UI.
 */
export const ExpandableBlock = ({
  expandLabel,
  collapseLabel,
  children,
  variant = 'accent',
}: ExpandableBlockProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen((prev) => !prev);

  return (
    <div className={cn(styles.root, styles[variant])}>
      <button aria-expanded={isOpen} className={styles.trigger} type="button" onClick={toggle}>
        <span className={styles.triggerInner}>
          {variant !== 'accent' && <span className={styles.icon}>{isOpen ? '−' : '+'}</span>}

          <span>{isOpen ? collapseLabel : expandLabel}</span>
        </span>
      </button>

      {isOpen && <div className={styles.content}>{children}</div>}
    </div>
  );
};
