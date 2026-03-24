/** Параметры выборки персон по профессии. */
export interface TGetPersonsByProfessionRequest {
  professionId: number;
  page?: number;
  limit?: number;
}
