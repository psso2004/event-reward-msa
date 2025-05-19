import {
  Body,
  Controller,
  Inject,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import {
  AuthServiceClient,
  AuthToken,
} from 'src/grpc-client/protos/generated/auth';
import { LoginInputDto } from '../dtos/inputs/login.input.dto';
import { LoginOutputDto } from '../dtos/outputs/login.output.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_PACKAGE_SERVICE')
    private readonly authService: AuthServiceClient,
  ) {}

  @Post('login')
  async login(
    @Body() body: LoginInputDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginOutputDto> {
    const result: AuthToken = await firstValueFrom(
      this.authService.login(body),
    );
    const { accessToken, refreshToken } = result;

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return new LoginOutputDto(accessToken);
  }

  @Post('refresh')
  async refresh(
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginOutputDto> {
    const refreshToken: string = req.cookies['refreshToken'];
    if (!refreshToken) throw new UnauthorizedException('No refresh token');

    const result = await firstValueFrom(
      this.authService.refreshToken({ refreshToken }),
    );

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return new LoginOutputDto(result.accessToken);
  }
}
