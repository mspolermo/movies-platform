export type TBreadcrumbItem = {
  label: string;
  /** Нет href — текущая страница (не ссылка). */
  href?: string;
};

export type TBreadcrumbsProps = {
  items: TBreadcrumbItem[];
  className?: string;
  'aria-label'?: string;
};
