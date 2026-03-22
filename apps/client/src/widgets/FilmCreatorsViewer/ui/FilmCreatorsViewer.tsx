'use client';

import { ProfessionsSlider } from '@/entities/profession';
import { FilmPersonsByProfession } from '@/features/getFilmPersonsByProfession';

import { useFilmCreatorViewer } from '../lib';

/**
 * UI-виджет для просмотра создателей и актеров фильма с возможность выбора профессии на слайдере (с загрузкой данных)
 */
export const FilmCreatorsViewer = () => {
  const {
    filmProfessions,
    loading,
    activeProfessionId,
    filmId,
    activeProfessionName,
    handleProfessionChange,
  } = useFilmCreatorViewer();

  if (loading) {
    return null;
  }

  if (filmProfessions.length === 0) {
    return null;
  }

  return (
    <>
      <ProfessionsSlider
        activeProfessionId={activeProfessionId}
        professions={filmProfessions}
        onProfessionChange={handleProfessionChange}
      />
      {activeProfessionId && (
        <FilmPersonsByProfession
          filmId={filmId}
          professionName={activeProfessionName}
        />
      )}
    </>
  );
};
