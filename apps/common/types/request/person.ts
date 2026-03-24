/** Параметры пагинации списка персон. */
export type TGetPersonsRequest = {
  page?: number;
  limit?: number;
};

/** Параметры запроса персоны с частичной фильмографией. */
export type TGetPersonByIdRequest = {
  id: number;
  filmsLimit?: number;
  filmsOffset?: number;
};

/** Параметры поиска персон по имени и профессии. */
export type TFindPersonsByNameAndProfessionRequest = {
  name?: string;
  professionId?: number;
};
