/** Параметры пагинации списка персон. */
export interface TGetPersonsRequest {
  page?: number;
  limit?: number;
}

/** Параметры запроса персоны с частичной фильмографией. */
export interface TGetPersonByIdRequest {
  id: number;
  filmsLimit?: number;
  filmsOffset?: number;
}

/** Параметры поиска персон по имени и профессии. */
export interface TFindPersonsByNameAndProfessionRequest {
  name?: string;
  professionId?: number;
}
