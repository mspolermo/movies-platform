export type { TRoleResponse } from "./role";
export type { TSearchResultResponse } from "./search";

/** Публичная форма пагинации (meta наружу только через response). */
export type { TPaginatedItemsResponse } from "../shared";

export type { TFilmFactResponse } from "./fact";

export type { TProfessionItemResponse } from "./profession";

export type { TCountryItemResponse, TCountriesListResponse } from "./country";
export type { TGenreItemResponse, TGenresListResponse } from "./genre";
export type {
  TCommentResponse,
  TCommentsPaginatedResponse,
  TToggleCommentLikeResponse,
} from "./comment";
export type { TUserBriefResponse, TUserTokenPayloadResponse } from "./user";
export type { TFiltersResponse, TQuickFiltersResponse } from "./filters";

export type {
  TFilmsResponse,
  TFilmListItemResponse,
  TFilmDetailsResponse,
  TPersonFilmResponse,
  TPersonFilmsListResponse,
  TPersonFilmsPaginationResponse,
} from "./film";

export type {
  TPersonProfessionResponse,
  TPersonProfileResponse,
  TPaginatedPersonsResponse,
  TPersonListItemResponse,
} from "./person";

export type {
  TAuthorizedUserResponse,
  TAuthResponse,
  TRegistrationResponse,
  TCurrentUserResponse,
  TRefreshTokenResponse,
  TAuthUsersRpcAuthResponse,
  TAuthUsersRpcRefreshRequest,
  TAuthUsersRpcLogoutRequest,
} from "./auth";

export type {
  TAdminFilmItemResponse,
  TGenreAdminItemResponse,
  TCountryAdminItemResponse,
  TProfessionAdminItemResponse,
  TPersonAdminItemResponse,
  TAdminUserItemResponse,
  TAdminFilmsListResponse,
  TAdminGenresListResponse,
  TAdminCountriesListResponse,
  TAdminProfessionsListResponse,
  TAdminPersonsListResponse,
  TAdminUsersListResponse,
} from "./admin";
