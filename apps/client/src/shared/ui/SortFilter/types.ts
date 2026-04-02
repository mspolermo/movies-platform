import type { TFilmSortBy } from "@common/types";

/**
 * Пропсы компонента SortFilter.
 *
 * Отвечает за отображение и изменение текущего типа сортировки фильмов.
 */
export type TSortFilterProps = {
  /** Значение сортировки. */
  selectedSort: TFilmSortBy;
  /** Функция для установки значения сортировки. */
  onUpdateSort: (sort: TFilmSortBy) => void;
}