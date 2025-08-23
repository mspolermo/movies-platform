export interface Role {
  id: number;
  value: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserRole {
  id: number;
  userId: number;
  roleId: number;
  role: Role;
  createdAt?: Date;
  updatedAt?: Date;
}
