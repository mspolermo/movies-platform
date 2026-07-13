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
  TPaginatedPersonsResponse,
  TPersonFilmsPaginationResponse,
  TPersonListItemResponse,
  TPersonProfileResponse,
  TProfessionItemResponse,
  TSearchFilmsParams,
  TGenresListResponse,
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
};
