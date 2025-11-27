'use client';

import { FilmPersonsByProfession } from '@/features/getFilmPersonsByProfession';
import { TFilmCreatorsViewerProps } from '../types';
import { ProfessionsSlider } from '@/entities/profession';
import { useFilmCreatorViewer } from '../lib';

/**
 * UI-виджет для просмотра создателей и актеров фильма с возможность выбора профессии на слайдере (с загрузкой данных)
 */
export const FilmCreatorsViewer = ({ professions = [] }: TFilmCreatorsViewerProps) => {
const {
  filmProfessions,
  loading,
  activeProfessionId,
  filmId,
  activeProfessionName,
  handleProfessionChange
} = useFilmCreatorViewer()

  if (loading) {
    return null;
  }

  if (filmProfessions.length === 0) {
    return null;
  }

  return (
    <>
      <ProfessionsSlider
        professions={filmProfessions}
        activeProfessionId={activeProfessionId}
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
