/** Доменная сущность факта с полями, которые реально хранятся в таблице. */
export interface TFactEntity {
  id: number;
  value: string;
  type: string;
  spoiler: boolean;
  filmId: number;
}