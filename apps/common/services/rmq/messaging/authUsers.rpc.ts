import type { AuthDto, CreateUserDto } from "@common/dto";
import type {
  TAuthorizedUserResponse,
  TAdminListRequest,
  TAdminSetUserRoleRpcRequest,
  TAdminUserItemResponse,
  TAdminUsersListResponse,
  TToggleFavoriteRpcRequest,
  TRemoveFavoriteRpcRequest,
  TListFavoritesRpcRequest,
  TFavoriteIdsRpcRequest,
  TUpsertFilmRatingRpcRequest,
  TDeleteFilmRatingRpcRequest,
  TListFilmRatingsRpcRequest,
  TFilmRatingGradesRpcRequest,
  TToggleFavoriteResponse,
  TMyFavoritesResponse,
  TMyFavoriteIdsResponse,
  TUpsertFilmRatingResponse,
  TDeleteFilmRatingResponse,
  TMyFilmRatingsResponse,
  TMyFilmRatingGradesResponse,
} from "@common/types";
import type {
  TAuthUsersRpcAuthResponse,
  TAuthUsersRpcLogoutRequest,
  TAuthUsersRpcRefreshRequest,
} from "@common/types/response/auth";

/**
 * Паттерны сообщений RabbitMQ для микросервиса auth-users.
 * Значения строк не менять без согласования — это контракт с api-gateway.
 */
export const authUsersRpc = {
  health: {
    ping: "health.ping",
  },
  users: {
    registration: "registration",
    login: "login",
    getById: "getUserById",
    refresh: "refresh",
    logout: "logout",
  },
  /** Admin (ADR-005/ADR-007): гейтвей проверяет роль ADMIN до вызова. */
  admin: {
    users: {
      list: "admin.users.list",
      setRole: "admin.users.setRole",
    },
  },
  /** User–film prefs (ADR-008). */
  favorites: {
    toggle: "favorites.toggle",
    remove: "favorites.remove",
    list: "favorites.list",
    ids: "favorites.ids",
  },
  ratings: {
    upsert: "ratings.upsert",
    delete: "ratings.delete",
    list: "ratings.list",
    grades: "ratings.grades",
  },
} as const;

export type TAuthUsersRpcContract = {
  [authUsersRpc.health.ping]: {
    request: Record<string, never>;
    response: true;
  };
  [authUsersRpc.users.registration]: {
    request: CreateUserDto;
    response: TAuthUsersRpcAuthResponse;
  };
  [authUsersRpc.users.login]: {
    request: AuthDto;
    response: TAuthUsersRpcAuthResponse;
  };
  [authUsersRpc.users.getById]: {
    request: number;
    response: TAuthorizedUserResponse;
  };
  [authUsersRpc.users.refresh]: {
    request: TAuthUsersRpcRefreshRequest;
    response: TAuthUsersRpcAuthResponse;
  };
  [authUsersRpc.users.logout]: {
    request: TAuthUsersRpcLogoutRequest;
    response: true;
  };
  [authUsersRpc.admin.users.list]: {
    request: TAdminListRequest;
    response: TAdminUsersListResponse;
  };
  [authUsersRpc.admin.users.setRole]: {
    request: TAdminSetUserRoleRpcRequest;
    response: TAdminUserItemResponse;
  };
  [authUsersRpc.favorites.toggle]: {
    request: TToggleFavoriteRpcRequest;
    response: TToggleFavoriteResponse;
  };
  [authUsersRpc.favorites.remove]: {
    request: TRemoveFavoriteRpcRequest;
    response: TToggleFavoriteResponse;
  };
  [authUsersRpc.favorites.list]: {
    request: TListFavoritesRpcRequest;
    response: TMyFavoritesResponse;
  };
  [authUsersRpc.favorites.ids]: {
    request: TFavoriteIdsRpcRequest;
    response: TMyFavoriteIdsResponse;
  };
  [authUsersRpc.ratings.upsert]: {
    request: TUpsertFilmRatingRpcRequest;
    response: TUpsertFilmRatingResponse;
  };
  [authUsersRpc.ratings.delete]: {
    request: TDeleteFilmRatingRpcRequest;
    response: TDeleteFilmRatingResponse;
  };
  [authUsersRpc.ratings.list]: {
    request: TListFilmRatingsRpcRequest;
    response: TMyFilmRatingsResponse;
  };
  [authUsersRpc.ratings.grades]: {
    request: TFilmRatingGradesRpcRequest;
    response: TMyFilmRatingGradesResponse;
  };
};
