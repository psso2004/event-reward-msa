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
  UserRole as UserRoleGrpc,
} from 'src/protos/generated/auth';
import { Empty } from 'src/protos/generated/google/protobuf/empty';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { UserRole } from 'src/enums/user-role.enum';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

@Controller('auth')
@AuthServiceControllerMethods()
export class AuthController implements AuthServiceController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async refreshToken(request: RefreshTokenRequest): Promise<AuthToken> {
    const { refreshToken } = request;

    const validToken =
      await this.userService.findValidRefreshToken(refreshToken);
    if (!validToken) {
      throw new RpcException({
        code: status.UNAUTHENTICATED,
        message: 'invalid refresh token',
      });
    }

    const payload = this.authService.verifyRefreshToken(refreshToken);
    if (!payload) {
      throw new RpcException({
        code: status.UNAUTHENTICATED,
        message: 'invalid refresh token',
      });
    }

    const newPayload = {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
    };
    const newAccessToken = this.authService.generateAccessToken(newPayload);
    const newRefreshToken = this.authService.generateRefreshToken(newPayload);

    await this.userService.revokeRefreshToken(refreshToken);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 90);
    await this.userService.saveRefreshToken(
      payload.sub,
      newRefreshToken,
      expiresAt,
    );

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async login(request: LoginRequest): Promise<AuthToken> {
    const { email, password } = request;

    const user = await this.userService.getUser({ email });
    if (!user) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'not found user',
      });
    }

    const isPasswordValid = await this.authService.validatePassword(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new RpcException({
        code: status.UNAUTHENTICATED,
        message: 'invalid password',
      });
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.authService.generateAccessToken(payload);
    const refreshToken = this.authService.generateRefreshToken(payload);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 90);
    await this.userService.saveRefreshToken(user.id, refreshToken, expiresAt);

    return { accessToken, refreshToken };
  }

  async getUser(request: Empty): Promise<User> {
    throw new Error('Method not implemented.');
  }

  async createUser(request: CreateUserRequest): Promise<User> {
    const { email, password, role } = request;
    const hashed = await this.authService.hashPassword(password);
    const user = await this.userService.createUser({
      email,
      password: hashed,
      role: role as unknown as UserRole,
    });

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  async updateUser(request: UpdateUserRequest): Promise<User> {
    const { id, email, password, role } = request;

    const updatedUser = await this.userService.updateUser({
      id,
      ...(email && { email }),
      ...(password && {
        password: await this.authService.hashPassword(password),
      }), // 관리자 전용: 사용자 비밀번호 직접 변경 기능
      ...(role && { role: role as unknown as UserRole }),
    });

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      role: updatedUser.role,
    };
  }

  async deleteUser(request: DeleteUserRequest): Promise<void> {
    const user = await this.userService.getUser({ id: request.id });
    if (!user) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'not found user',
      });
    }

    await this.userService.deleteUser(request.id);
  }
}
