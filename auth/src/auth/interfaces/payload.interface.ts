import { UserRole } from 'src/protos/generated/auth';

export interface IPayload {
  sub: string;
  email: string;
  role: UserRole;
}
