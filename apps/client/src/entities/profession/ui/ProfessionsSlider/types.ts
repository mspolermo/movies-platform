import type { TProfessionItemResponse } from '@common/types';

export interface TProfessionsTabsProps {
  professions: TProfessionItemResponse[];
  activeProfessionId: number | null;
  onProfessionChange: (professionId: number) => void;
}
