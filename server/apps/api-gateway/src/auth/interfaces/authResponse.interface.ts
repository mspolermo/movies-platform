import { Role } from '../../shared';

export interface AuthResponse {
  email: string;
  userId: number;
  role: Role[];
  token: string;
}
