import type { FactsProps } from '../../types';

import { useMemo } from 'react';

import { ExpandableBlock } from '@/shared/ui';

import styles from './Facts.module.scss';
import { checkIsCartoon } from '../../../../lib';

const FACT_GROUP_LABELS: Record<string, string> = {
  BLOOPER: 'киноляпы',
  FACT: 'факты',
};

type FactGroup = {
  type: string;
  label: string;
  facts: NonNullable<FactsProps['film']['facts']>;
};

/**
 * Блок фактов и киноляпов.
 */
export const Facts = ({ film: { facts, genres } }: FactsProps) => {
  const isCartoon = checkIsCartoon(genres ?? []);

  const factGroups = useMemo<FactGroup[]>(() => {
    if (!facts?.length) return [];

    const groups = new Map<string, FactGroup>();

    facts
      .filter((f) => f?.value)
      .forEach((f) => {
        const type = f.type?.trim().toUpperCase() || 'FACT';

        if (!groups.has(type)) {
          groups.set(type, {
            type,
            label: FACT_GROUP_LABELS[type] ?? type,
            facts: [],
          });
        }

        groups.get(type)!.facts.push(f);
      });

    return Array.from(groups.values());
  }, [facts]);

  if (!factGroups.length) return null;

  return (
    <ExpandableBlock
      collapseLabel="Скрыть детали"
      expandLabel={`Показать особенности ${isCartoon ? 'мультфильма' : 'фильма'}`}
    >
      <div className={styles.root}>
        {factGroups.map((group) => (
          <section key={group.type} aria-label={group.label} className={styles.group}>
            <ExpandableBlock
              collapseLabel={`Скрыть ${group.label}`}
              expandLabel={`Показать ${group.label}`}
              variant="neutral"
            >
              <ul className={styles.items}>
                {group.facts.map((fact, index) => (
                  <li key={`${group.type}-${index}`} className={styles.item}>
                    {fact.spoiler ? (
                      <ExpandableBlock
                        collapseLabel="Скрыть"
                        expandLabel="Осторожно: спойлер"
                        variant="warning"
                      >
                        <p className={styles.text}>{fact.value}</p>
                      </ExpandableBlock>
                    ) : (
                      <p className={styles.text}>{fact.value}</p>
                    )}
                  </li>
                ))}
              </ul>
            </ExpandableBlock>
          </section>
        ))}
      </div>
    </ExpandableBlock>
  );
};
