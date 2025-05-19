import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { of } from 'rxjs';
import { CreateUserInputDto } from '../dtos/inputs/create-user.input.dto';
import { UpdateUserInputDto } from '../dtos/inputs/update-user.input.dto';
import { DeleteUserInputDto } from '../dtos/inputs/delete-user.input.dto';
import { UserOutputDto } from '../dtos/outputs/user.output.dto';
import { UserRole } from '../dtos/inputs/create-user.input.dto';

describe('UserController', () => {
  let controller: UserController;
  let mockAuthService: any;

  beforeEach(async () => {
    mockAuthService = {
      createUser: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: 'AUTH_PACKAGE_SERVICE',
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('사용자를 성공적으로 생성하고 UserOutputDto를 반환해야 함', async () => {
      // given
      const createUserDto: CreateUserInputDto = {
        email: 'test@example.com',
        password: 'password123',
        role: UserRole.USER,
      };

      const mockGrpcResponse = {
        id: 'user-123',
        email: createUserDto.email,
        role: UserRole.USER,
      };

      mockAuthService.createUser.mockReturnValue(of(mockGrpcResponse));

      // when
      const result = await controller.createUser(createUserDto);

      // then
      expect(mockAuthService.createUser).toHaveBeenCalledWith(createUserDto);
      expect(result).toBeInstanceOf(UserOutputDto);
      expect(result).toEqual({
        id: mockGrpcResponse.id,
        email: mockGrpcResponse.email,
        role: mockGrpcResponse.role,
      });
    });
  });

  describe('updateUser', () => {
    it('사용자 정보를 성공적으로 업데이트하고 UserOutputDto를 반환해야 함', async () => {
      // given
      const updateUserDto: UpdateUserInputDto = {
        id: 'user-123',
        email: 'updated@example.com',
        password: 'newpassword123',
        role: UserRole.ADMIN,
      };

      const mockGrpcResponse = {
        id: updateUserDto.id,
        email: updateUserDto.email,
        role: updateUserDto.role,
      };

      mockAuthService.updateUser.mockReturnValue(of(mockGrpcResponse));

      // when
      const result = await controller.updateUser(updateUserDto);

      // then
      expect(mockAuthService.updateUser).toHaveBeenCalledWith(updateUserDto);
      expect(result).toBeInstanceOf(UserOutputDto);
      expect(result).toEqual({
        id: mockGrpcResponse.id,
        email: mockGrpcResponse.email,
        role: mockGrpcResponse.role,
      });
    });
  });

  describe('deleteUser', () => {
    it('사용자를 성공적으로 삭제해야 함', async () => {
      // given
      const deleteUserDto: DeleteUserInputDto = {
        id: 'user-123',
      };

      mockAuthService.deleteUser.mockReturnValue(of({}));

      // when
      await controller.deleteUser(deleteUserDto);

      // then
      expect(mockAuthService.deleteUser).toHaveBeenCalledWith(deleteUserDto);
    });
  });
});
