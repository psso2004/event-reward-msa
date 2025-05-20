import { UserRole } from 'src/grpc-client/protos/generated/auth';

export interface IPayload {
  sub: string;
  email: string;
  role: UserRole;
}
