import type { FactBlockProps } from '../../types';

import React, { useMemo, useState } from 'react';

import styles from './FactBlock.module.scss';

const FACT_GROUP_LABELS: Record<string, string> = {
  BLOOPER: 'Киноляпы',
  FACT: 'Факты',
};

type TFactGroup = {
  type: string;
  label: string;
  facts: NonNullable<FactBlockProps['facts']>;
};

export const FactBlock = ({ facts, isCartoon }: FactBlockProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const factGroups = useMemo<TFactGroup[]>(() => {
    if (!facts?.length) {
      return [];
    }

    const groups = new Map<string, TFactGroup>();

    facts
      .filter((factItem) => Boolean(factItem?.value))
      .forEach((factItem) => {
        const normalizedType = factItem.type?.trim().toUpperCase() || 'FACT';
        const existingGroup = groups.get(normalizedType);

        if (existingGroup) {
          existingGroup.facts.push(factItem);
          return;
        }

        groups.set(normalizedType, {
          type: normalizedType,
          label: FACT_GROUP_LABELS[normalizedType] ?? normalizedType,
          facts: [factItem],
        });
      });

    return Array.from(groups.values());
  }, [facts]);

  const handleToggleExpanded = () => {
    setIsExpanded((currentValue) => !currentValue);
  };

  if (!factGroups.length) {
    return null;
  }

  return (
    <div className={styles.factBlock}>
      <button
        aria-expanded={isExpanded}
        className={`${styles.title} ${styles.titleButton}`}
        type="button"
        onClick={handleToggleExpanded}
      >
        {`${isExpanded ? 'Скрыть' : 'Показать'} факты о ${isCartoon ? 'мультфильме' : 'фильме'}`}
      </button>
      {isExpanded && (
        <div className={styles.groups}>
          {factGroups.map((group) => (
            <section key={group.type} className={styles.group}>
              <h4 className={styles.groupTitle}>{group.label}</h4>
              <div className={styles.items}>
                {group.facts.map((factItem, index) => (
                  <article
                    key={`${group.type}-${index}-${factItem.value.slice(0, 30)}`}
                    className={styles.item}
                  >
                    <p className={styles.text}>{factItem.value}</p>
                    {factItem.spoiler && (
                      <p className={styles.spoilerMark}>Содержит спойлер</p>
                    )}
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};
