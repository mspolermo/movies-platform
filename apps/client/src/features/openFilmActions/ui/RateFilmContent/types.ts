export type TRateFilmContentProps = {
  onSelect: (grade: number) => void;
  /** Текущая оценка при редактировании. */
  selectedGrade?: number | null;
  onDelete?: () => void;
  error?: string | null;
  isSubmitting?: boolean;
};
