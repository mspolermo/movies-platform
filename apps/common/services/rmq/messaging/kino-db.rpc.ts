import type {
  TCommentResponse,
  TCommentsPaginatedResponse,
  TCreateCommentRpcRequest,
  TGetFilmCommentsRpcRequest,
  TToggleCommentLikeRequest,
  TToggleCommentLikeResponse,
  TCountriesListResponse,
  TFilmDetailsResponse,
  TFilmListItemResponse,
  TFilmsResponse,
  TFindPersonsByNameAndProfessionRequest,
  TGetFilmPersonsByProfessionRequest,
  TGetPersonByIdRequest,
  TGetPersonFilmsRequest,
  TGetPersonsByProfessionRequest,
  TGetPersonsRequest,
  TGetSimilarFilmsRequest,
  TPaginatedPersonsResponse,
  TPersonFilmsPaginationResponse,
  TPersonListItemResponse,
  TPersonProfileResponse,
  TProfessionItemResponse,
  TSearchFilmsParams,
  TGenresListResponse,
  TAdminListRequest,
  TAdminFilmItemResponse,
  TAdminFilmsListResponse,
  TAdminUpdateFilmRpcRequest,
  TCreateFilmRequest,
  TAdminGenreItemResponse,
  TAdminGenresListResponse,
  TAdminUpdateGenreRpcRequest,
  TCreateGenreRequest,
  TAdminCountryItemResponse,
  TAdminCountriesListResponse,
  TAdminUpdateCountryRpcRequest,
  TCreateCountryRequest,
  TAdminProfessionItemResponse,
  TAdminProfessionsListResponse,
  TAdminUpdateProfessionRpcRequest,
  TCreateProfessionRequest,
  TAdminPersonItemResponse,
  TAdminPersonsListResponse,
  TAdminUpdatePersonRpcRequest,
  TCreatePersonRequest,
} from "../../../types";

/**
 * Паттерны сообщений RabbitMQ для микросервиса kino-db.
 * Значения строк не менять без согласования — это контракт с api-gateway.
 */
export const kinoDbRpc = {
  health: {
    ping: "health.ping",
  },
  comments: {
    create: "createComment",
    getByFilmId: "getCommentsByFilmId",
    toggleLike: "toggleCommentLike",
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
    getSimilar: "getSimilarFilms",
  },
  genres: {
    getAll: "getAll.genres",
  },
  persons: {
    getAllPaginated: "getAllPersonsPaginated",
    getByProfessionId: "getPersonsByProfessionId",
    getById: "getPersonById",
    getFilmography: "getPersonFilmography",
    findByNameAndProfession: "findPersonsByNameAndProfession"
  },
  professions: {
    getAll: "getAll.professions",
  },
  /** Admin CRUD (ADR-005/ADR-007): гейтвей проверяет роль ADMIN до вызова. */
  admin: {
    films: {
      list: "admin.films.list",
      getById: "admin.films.getById",
      create: "admin.films.create",
      update: "admin.films.update",
      delete: "admin.films.delete",
    },
    genres: {
      list: "admin.genres.list",
      create: "admin.genres.create",
      update: "admin.genres.update",
      delete: "admin.genres.delete",
    },
    countries: {
      list: "admin.countries.list",
      create: "admin.countries.create",
      update: "admin.countries.update",
      delete: "admin.countries.delete",
    },
    professions: {
      list: "admin.professions.list",
      create: "admin.professions.create",
      update: "admin.professions.update",
      delete: "admin.professions.delete",
    },
    persons: {
      list: "admin.persons.list",
      getById: "admin.persons.getById",
      create: "admin.persons.create",
      update: "admin.persons.update",
      delete: "admin.persons.delete",
    },
  },
} as const;

export type TKinoDbRpcContract = {
  [kinoDbRpc.health.ping]: {
    request: Record<string, never>;
    response: true;
  };
  [kinoDbRpc.comments.create]: {
    request: TCreateCommentRpcRequest;
    response: TCommentResponse;
  };
  [kinoDbRpc.comments.getByFilmId]: {
    request: TGetFilmCommentsRpcRequest;
    response: TCommentsPaginatedResponse;
  };
  [kinoDbRpc.comments.toggleLike]: {
    request: TToggleCommentLikeRequest;
    response: TToggleCommentLikeResponse;
  };
  [kinoDbRpc.countries.getAll]: {
    request: Record<string, never>;
    response: TCountriesListResponse;
  };
  [kinoDbRpc.films.getById]: {
    request: number;
    response: TFilmDetailsResponse | null;
  };
  [kinoDbRpc.films.filters]: {
    request: TSearchFilmsParams;
    response: TFilmsResponse;
  };
  [kinoDbRpc.films.getAllFilmYears]: {
    request: Record<string, never>;
    response: number[];
  };
  [kinoDbRpc.films.searchFilmsByName]: {
    request: string;
    response: TFilmListItemResponse[];
  };
  [kinoDbRpc.films.getFilmProfessions]: {
    request: number;
    response: TProfessionItemResponse[];
  };
  [kinoDbRpc.films.getFilmPersonsByProfession]: {
    request: TGetFilmPersonsByProfessionRequest;
    response: TPaginatedPersonsResponse | null;
  };
  [kinoDbRpc.films.getSimilar]: {
    request: TGetSimilarFilmsRequest;
    response: TFilmListItemResponse[] | null;
  };
  [kinoDbRpc.genres.getAll]: {
    request: Record<string, never>;
    response: TGenresListResponse;
  };
  [kinoDbRpc.persons.getAllPaginated]: {
    request: TGetPersonsRequest;
    response: TPaginatedPersonsResponse;
  };
  [kinoDbRpc.persons.getByProfessionId]: {
    request: TGetPersonsByProfessionRequest;
    response: TPaginatedPersonsResponse;
  };
  [kinoDbRpc.persons.getById]: {
    request: TGetPersonByIdRequest;
    response: TPersonProfileResponse | null;
  };
  [kinoDbRpc.persons.getFilmography]: {
    request: TGetPersonFilmsRequest;
    response: TPersonFilmsPaginationResponse | null;
  };
  [kinoDbRpc.persons.findByNameAndProfession]: {
    request: TFindPersonsByNameAndProfessionRequest;
    response: TPersonListItemResponse[];
  };
  [kinoDbRpc.professions.getAll]: {
    request: Record<string, never>;
    response: TProfessionItemResponse[];
  };
  [kinoDbRpc.admin.films.list]: {
    request: TAdminListRequest;
    response: TAdminFilmsListResponse;
  };
  [kinoDbRpc.admin.films.getById]: {
    request: number;
    response: TAdminFilmItemResponse;
  };
  [kinoDbRpc.admin.films.create]: {
    request: TCreateFilmRequest;
    response: TAdminFilmItemResponse;
  };
  [kinoDbRpc.admin.films.update]: {
    request: TAdminUpdateFilmRpcRequest;
    response: TAdminFilmItemResponse;
  };
  [kinoDbRpc.admin.films.delete]: {
    request: number;
    response: true;
  };
  [kinoDbRpc.admin.genres.list]: {
    request: TAdminListRequest;
    response: TAdminGenresListResponse;
  };
  [kinoDbRpc.admin.genres.create]: {
    request: TCreateGenreRequest;
    response: TAdminGenreItemResponse;
  };
  [kinoDbRpc.admin.genres.update]: {
    request: TAdminUpdateGenreRpcRequest;
    response: TAdminGenreItemResponse;
  };
  [kinoDbRpc.admin.genres.delete]: {
    request: number;
    response: true;
  };
  [kinoDbRpc.admin.countries.list]: {
    request: TAdminListRequest;
    response: TAdminCountriesListResponse;
  };
  [kinoDbRpc.admin.countries.create]: {
    request: TCreateCountryRequest;
    response: TAdminCountryItemResponse;
  };
  [kinoDbRpc.admin.countries.update]: {
    request: TAdminUpdateCountryRpcRequest;
    response: TAdminCountryItemResponse;
  };
  [kinoDbRpc.admin.countries.delete]: {
    request: number;
    response: true;
  };
  [kinoDbRpc.admin.professions.list]: {
    request: TAdminListRequest;
    response: TAdminProfessionsListResponse;
  };
  [kinoDbRpc.admin.professions.create]: {
    request: TCreateProfessionRequest;
    response: TAdminProfessionItemResponse;
  };
  [kinoDbRpc.admin.professions.update]: {
    request: TAdminUpdateProfessionRpcRequest;
    response: TAdminProfessionItemResponse;
  };
  [kinoDbRpc.admin.professions.delete]: {
    request: number;
    response: true;
  };
  [kinoDbRpc.admin.persons.list]: {
    request: TAdminListRequest;
    response: TAdminPersonsListResponse;
  };
  [kinoDbRpc.admin.persons.getById]: {
    request: number;
    response: TAdminPersonItemResponse;
  };
  [kinoDbRpc.admin.persons.create]: {
    request: TCreatePersonRequest;
    response: TAdminPersonItemResponse;
  };
  [kinoDbRpc.admin.persons.update]: {
    request: TAdminUpdatePersonRpcRequest;
    response: TAdminPersonItemResponse;
  };
  [kinoDbRpc.admin.persons.delete]: {
    request: number;
    response: true;
  };
};
