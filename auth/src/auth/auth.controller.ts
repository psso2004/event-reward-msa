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
} from 'src/protos/generated/auth';
import { Empty } from 'src/protos/generated/google/protobuf/empty';

@Controller('auth')
@AuthServiceControllerMethods()
export class AuthController implements AuthServiceController {
  async refreshToken(request: RefreshTokenRequest): Promise<AuthToken> {
    return {
      accessToken: 'test',
      refreshToken: 'test',
    };
  }

  async login(request: LoginRequest): Promise<AuthToken> {
    console.log('test');
    console.log(request);
    //throw new Error('Method not implemented.');
    return {
      accessToken: 'test',
      refreshToken: 'test',
    };
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
