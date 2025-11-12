import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './CardsBlock.module.scss';
import { Card } from '@/shared/ui';
import { CardsBlockProps } from '../../types';

export const CardsBlock = ({ professions = [] }: CardsBlockProps) => {
  const router = useRouter();

  // Находим профессию "актеры" (с учетом разных вариантов написания)
  const actorsProfession = professions.find((prof) => {
    const name = prof.name?.toLowerCase() || '';
    return name.includes('актер') || name.includes('actor');
  });

  // Получаем список актеров из профессии или первые 5 персон из первой профессии
  const actors = actorsProfession
    ? actorsProfession.persons.slice(0, 5)
    : professions[0]?.persons?.slice(0, 5) || [];

  const handleActorClick = (actorId: number) => {
    router.push(`/persons/${actorId}`);
  };

  return (
    <div className={styles.cardsBlock}>
      {actors.map((actor) => (
        <Card
          key={actor.id}
          type="small"
          title={actor.nameRu || actor.nameEn}
          photoUrl={actor.photoUrl}
          onClick={() => handleActorClick(actor.id)}
        />
      ))}
    </div>
  );
};
