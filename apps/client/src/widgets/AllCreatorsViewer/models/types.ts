import type { TProfessionItemResponse } from '@common/types';

export type TAllCreatorsViewerLoadingProps = {
  isLoading: true;
  professions?: never;
  initialActiveProfessionId?: never;
};

export type TAllCreatorsViewerProps =
  | TAllCreatorsViewerLoadingProps
  | ({
      isLoading?: false;
    } & {
      professions: TProfessionItemResponse[];
      initialActiveProfessionId: number | null;
    });

/** Режим с данными профессий (без навигационного скелетона). */
export type TAllCreatorsViewerReadyProps = Exclude<
  TAllCreatorsViewerProps,
  TAllCreatorsViewerLoadingProps
>;
