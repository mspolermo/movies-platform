/**
 * Паттерны сообщений RabbitMQ для микросервиса kino-db.
 * Значения строк не менять без согласования — это контракт с api-gateway.
 */
export const kinoDbRpc = {
  comments: {
    create: "createComment",
    getByFilmId: "getCommentsByFilmId",
  },
  countries: {
    getAll: "getAll.countries",
  },
  films: {
    getById: "getFilmById",
    filters: "filters",
    getAllFilmYears: "getAllFilmYears",
    searchFilmsByName: "searchFilmsByName",
    getFilmProfessions: "getFilmProfessions",
    getFilmPersonsByProfession: "getFilmPersonsByProfession",
  },
  genres: {
    getAll: "getAll.genres",
  },
  persons: {
    getAllPaginated: "getAllPersonsPaginated",
    getByProfessionId: "getPersonsByProfessionId",
    getById: "getPersonById",
    findByNameAndProfession: "findPersonsByNameAndProfession",
    searchByName: "searchPersonsByName",
  },
  professions: {
    getAll: "getAll.professions",
  },
} as const;
