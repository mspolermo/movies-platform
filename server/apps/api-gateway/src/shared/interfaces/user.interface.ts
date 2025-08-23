import { Role } from './role.interface';

export interface User {
  id: number;
  email: string;
  password?: string;
  roles?: Role[];
  createdAt?: Date;
  updatedAt?: Date;
}
