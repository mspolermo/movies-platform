import type {
  TAdminListRequest,
  TAdminUserItemResponse,
  TAdminUsersListResponse,
  TUpdateUserRoleRequest,
} from '@common/types';

import apiClient, { API_ENDPOINTS } from '@/shared/api';

export const listUsers = async (
  params: TAdminListRequest = {}
): Promise<TAdminUsersListResponse> => {
  const { data } = await apiClient.get<TAdminUsersListResponse>(API_ENDPOINTS.ADMIN.USERS.LIST, {
    params,
  });
  return data;
};

export const setUserRole = async (
  id: number,
  payload: TUpdateUserRoleRequest
): Promise<TAdminUserItemResponse> => {
  const { data } = await apiClient.patch<TAdminUserItemResponse>(
    API_ENDPOINTS.ADMIN.USERS.BY_ID(id),
    payload
  );
  return data;
};
