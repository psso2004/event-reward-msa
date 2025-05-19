import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { Response } from 'express';
import { of } from 'rxjs';
import { AuthToken } from 'src/grpc-client/protos/generated/auth';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: any;

  beforeEach(async () => {
    mockAuthService = {
      login: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: 'AUTH_PACKAGE_SERVICE',
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('성공적으로 로그인하고 토큰을 반환해야 함', async () => {
      const mockLoginInput = {
        email: 'test@example.com',
        password: 'password123',
      };
      const mockAuthToken: AuthToken = {
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      };
      const mockResponse = {
        cookie: jest.fn(),
      } as unknown as Response;

      mockAuthService.login.mockReturnValue(of(mockAuthToken));

      // when
      const result = await controller.login(mockLoginInput, mockResponse);

      // then
      expect(mockAuthService.login).toHaveBeenCalledWith(mockLoginInput);
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'refreshToken',
        mockAuthToken.refreshToken,
        {
          httpOnly: true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
        },
      );
      expect(result).toEqual({
        accessToken: mockAuthToken.accessToken,
      });
    });
  });

  describe('refresh', () => {
    it('리프레시 토큰이 없으면 UnauthorizedException을 던져야 함', async () => {
      const mockRequest = {
        cookies: {},
      };
      const mockResponse = {
        cookie: jest.fn(),
      } as unknown as Response;

      await expect(
        controller.refresh(mockRequest, mockResponse),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('성공적으로 토큰을 갱신하고 새로운 토큰을 반환해야 함', async () => {
      const mockRefreshToken = 'mock-refresh-token';
      const mockRequest = {
        cookies: {
          refreshToken: mockRefreshToken,
        },
      };
      const mockResponse = {
        cookie: jest.fn(),
      } as unknown as Response;
      const mockAuthToken: AuthToken = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      };

      mockAuthService.refreshToken.mockReturnValue(of(mockAuthToken));

      const result = await controller.refresh(mockRequest, mockResponse);

      expect(mockAuthService.refreshToken).toHaveBeenCalledWith({
        refreshToken: mockRefreshToken,
      });
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'refreshToken',
        mockAuthToken.refreshToken,
        {
          httpOnly: true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
        },
      );
      expect(result).toEqual({
        accessToken: mockAuthToken.accessToken,
      });
    });
  });
});
