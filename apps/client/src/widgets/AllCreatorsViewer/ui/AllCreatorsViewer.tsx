'use client';

import type { TAllCreatorsViewerProps } from '../models';

import { AllCreatorsViewerDiscovery } from './AllCreatorsDiscovery';
import { AllCreatorsLoader } from './AllCreatorsLoader';

/**
 * UI-виджет для просмотра всех персон разбитых по профессиям на слайдере (с загрузкой данных)
 */
export const AllCreatorsViewer = (props: TAllCreatorsViewerProps) => {
  if (props.isLoading) {
    return <AllCreatorsLoader />
  }

  return <AllCreatorsViewerDiscovery {...props} />;
};
