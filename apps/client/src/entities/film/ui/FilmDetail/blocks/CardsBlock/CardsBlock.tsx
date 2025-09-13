import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './CardsBlock.module.scss';
import { TPersonModel } from '@common/types';
import { Card } from '@/shared/ui';

interface CardsBlockProps {
  ratingKp?: number;
  persons?: TPersonModel[];
}

export const CardsBlock: React.FC<CardsBlockProps> = ({ ratingKp, persons = [] }) => {
  const router = useRouter();

  const getActors = () => {
    const filteredList = persons.filter(person => 
      person.professions?.[0]?.name === 'актеры'
    );
    
    return filteredList.length >= 5 
      ? filteredList.slice(0, 5)
      : persons.slice(0, 5);
  };

  const actors = getActors();

  const handleActorClick = (actorId: number) => {
    router.push(`/persons/${actorId}`);
  };

  const handleRatingClick = () => {
    // TODO: Implement rating functionality
  };

  return (
    <div className={styles.cardsBlock}>
      <Card 
        type="reit"
        ratingKp={ratingKp}
        onClick={handleRatingClick}
      />
      {actors.map(actor => (
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
