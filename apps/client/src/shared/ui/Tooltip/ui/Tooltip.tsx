'use client';

import type { TTooltipProps } from '../model';

import { useId } from 'react';
import { createPortal } from 'react-dom';

import { useTooltip } from '../lib';
import styles from './Tooltip.module.scss';

export const Tooltip = ({
  content,
  children,
  position = 'top',
  delay = 300,
  disabled = false,
  className = '',
}: TTooltipProps) => {
  const tooltipId = useId();
  const {
    isVisible,
    isAnimating,
    tooltipPosition,
    triggerRef,
    tooltipRef,
    showTooltip,
    hideTooltip,
  } = useTooltip({ position, delay, disabled });

  const tooltipElement = isVisible && (
    <div
      ref={tooltipRef}
      className={`${styles.tooltip} ${styles[`tooltip_${position}`]} ${isAnimating ? styles.tooltip_visible : styles.tooltip_hidden} ${className}`}
      id={tooltipId}
      role="tooltip"
      style={{
        top: tooltipPosition.top,
        left: tooltipPosition.left,
      }}
    >
      <div className={styles.tooltip__content}>{content}</div>
      <div className={`${styles.tooltip__arrow} ${styles[`tooltip__arrow_${position}`]}`} />
    </div>
  );

  return (
    <>
      <div
        ref={triggerRef}
        aria-describedby={isVisible ? tooltipId : undefined}
        style={{ display: 'inline-block' }}
        onBlur={hideTooltip}
        onFocus={showTooltip}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
      >
        {children}
      </div>
      {typeof document !== 'undefined' &&
        isVisible &&
        tooltipElement &&
        createPortal(tooltipElement, document.body)}
    </>
  );
};
