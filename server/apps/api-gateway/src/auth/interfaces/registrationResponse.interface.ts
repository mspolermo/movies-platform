import { User, Role } from '../../shared';

export interface RegistrationResponse {
  User: User;
  role: Role[];
  token: string;
}
