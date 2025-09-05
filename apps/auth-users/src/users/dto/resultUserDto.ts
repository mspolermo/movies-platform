import { TUserResult } from "@common/types";

export class ResultUsersDto implements TUserResult {
  id: number;
  email: string;
  name?: string;
  roles?: { id: number; value: string }[];
  createdAt?: Date;
  updatedAt?: Date;
}
