/** Параметры выборки персон по профессии. */
export type TGetPersonsByProfessionRequest = {
  professionId: number;
  page?: number;
  limit?: number;
};
