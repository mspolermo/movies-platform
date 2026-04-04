/** Пропсы презентационных списков жанров/стран (логика и FilterDropdown — в родителе). */
export type TWideCheckboxListViewProps = {
  entries: Array<{ key: string; value: string; label: string }>;
  isSelected: (value: string) => boolean;
  onToggle: (value: string) => void;
};
