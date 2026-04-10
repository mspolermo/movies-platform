import type { TProfessionItemResponse } from '@common/types';

export interface TAllCreatorsViewerProps {
  professions: TProfessionItemResponse[];
  initialActiveProfessionId: number | null;
}
