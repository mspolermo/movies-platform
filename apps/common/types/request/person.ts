/** Параметры пагинации списка персон. */
export type TGetPersonsRequest = {
  page?: number;
  limit?: number;
};

/** Параметры запроса профиля персоны по id. */
export type TGetPersonByIdRequest = {
  id: number;
};

/** Параметры запроса страницы фильмографии персоны. */
export type TGetPersonFilmographyRequest = {
  id: number;
  limit?: number;
  offset?: number;
};

/** Параметры поиска персон по имени и профессии. */
export type TFindPersonsByNameAndProfessionRequest = {
  name?: string;
  professionId?: number;
};
