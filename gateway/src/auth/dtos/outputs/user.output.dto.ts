import { UserRole } from 'src/auth/enums/user-role.enum';
import {
  User,
  UserRole as GrpcUserRole,
} from 'src/grpc-client/protos/generated/auth';

export class UserOutputDto {
  id: string;
  email: string;
  role: UserRole;

  constructor(id: string, email: string, role: UserRole) {
    this.id = id;
    this.email = email;
    this.role = role;
  }

  static fromGrpcResponse(response: User): UserOutputDto {
    const role =
      response.role === GrpcUserRole.UNRECOGNIZED
        ? UserRole.USER_UNSPECIFIED
        : (response.role as UserRole);
    return new UserOutputDto(response.id, response.email, role);
  }
}
