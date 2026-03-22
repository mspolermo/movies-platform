import type { TProfessionBased } from '@common/types';

export interface TProfessionsTabsProps {
  professions: TProfessionBased[];
  activeProfessionId: number | null;
  onProfessionChange: (professionId: number) => void;
}
