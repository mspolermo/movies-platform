/** Доменная сущность персоны с полями таблицы. */
export interface TPersonEntity {
  id: number;
  photoUrl: string;
  nameRu: string;
  nameEn: string;
  createdAt?: Date;
  updatedAt?: Date;
}