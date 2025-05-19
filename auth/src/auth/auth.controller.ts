import { Controller } from '@nestjs/common';
import {
  AuthServiceController,
  AuthServiceControllerMethods,
  AuthToken,
  CreateUserRequest,
  DeleteUserRequest,
  LoginRequest,
  RefreshTokenRequest,
  UpdateUserRequest,
  User,
  UserRole,
} from 'src/protos/generated/auth';
import { Empty } from 'src/protos/generated/google/protobuf/empty';
import { AuthService } from './auth.service';

@Controller('auth')
@AuthServiceControllerMethods()
export class AuthController implements AuthServiceController {
  constructor(private readonly authService: AuthService) {}

  async refreshToken(request: RefreshTokenRequest): Promise<AuthToken> {
    return {
      accessToken: 'test',
      refreshToken: 'test',
    };
  }

  async login(request: LoginRequest): Promise<AuthToken> {
    const user = {
      id: '1234',
      email: 'test@test.com',
      password: 'test1234',
      role: UserRole.ADMIN,
    };

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.authService.generateAccessToken(payload);
    const refreshToken = this.authService.generateRefreshToken(payload);

    return { accessToken, refreshToken };
  }

  async getUser(request: Empty): Promise<User> {
    throw new Error('Method not implemented.');
  }

  async createUser(request: CreateUserRequest): Promise<User> {
    throw new Error('Method not implemented.');
  }

  async updateUser(request: UpdateUserRequest): Promise<User> {
    throw new Error('Method not implemented.');
  }

  async deleteUser(request: DeleteUserRequest): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
