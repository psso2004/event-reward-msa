import { Body, Controller, Delete, Inject, Post, Put } from '@nestjs/common';
import { AuthServiceClient } from 'src/grpc-client/protos/generated/auth';
import { CreateUserInputDto } from './dtos/inputs/create-user.input.dto';
import { firstValueFrom } from 'rxjs';
import { UserOutputDto } from './dtos/outputs/user.output.dto';
import { UpdateUserInputDto } from './dtos/inputs/update-user.input.dto';
import { DeleteUserInputDto } from './dtos/inputs/delete-user.input.dto';

@Controller('user')
export class UserController {
  constructor(
    @Inject('AUTH_PACKAGE_SERVICE')
    private readonly authService: AuthServiceClient,
  ) {}

  @Post()
  async createUser(
    @Body() createUserDto: CreateUserInputDto,
  ): Promise<UserOutputDto> {
    const response = await firstValueFrom(
      this.authService.createUser(createUserDto),
    );
    return UserOutputDto.fromGrpcResponse(response);
  }

  @Put()
  async updateUser(
    @Body() updateUserDto: UpdateUserInputDto,
  ): Promise<UserOutputDto> {
    const response = await firstValueFrom(
      this.authService.updateUser(updateUserDto),
    );
    return UserOutputDto.fromGrpcResponse(response);
  }

  @Delete()
  async deleteUser(@Body() deleteUserDto: DeleteUserInputDto): Promise<void> {
    await firstValueFrom(this.authService.deleteUser(deleteUserDto));
  }
}
