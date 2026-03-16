export type TQickFilterHeading = {
  type: 'heading';
  label: string;
};

export type TQickFilterItem = {
  type: 'item';
  label: string | number;
  key: string | number;
  onClick: () => void;
};

export type TQickFilter = TQickFilterHeading | TQickFilterItem;