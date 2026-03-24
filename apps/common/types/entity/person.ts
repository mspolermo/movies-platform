/** Доменная сущность персоны с полями таблицы. */
export type TPersonEntity = {
  id: number;
  photoUrl: string;
  nameRu: string;
  nameEn: string;
  createdAt?: Date;
  updatedAt?: Date;
};
