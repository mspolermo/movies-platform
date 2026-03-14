export type TDropdownHeading = {
  type: 'heading';
  label: string;
};

export type TDropdownItem = {
  type: 'item';
  label: string | number;
  key: string | number;
  onClick: () => void;
};

export type TDropdownElement = TDropdownHeading | TDropdownItem;