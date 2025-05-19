import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { GrpcClientModule } from 'src/grpc-client/grpc-client.module';
import { UserController } from './user.controller';

@Module({
  imports: [
    GrpcClientModule.forRootAsync({
      name: 'AUTH_PACKAGE',
      package: 'auth',
      url: 'GRPC_AUTH_URL',
      serviceName: 'AuthService',
    }),
  ],
  controllers: [AuthController, UserController],
})
export class AuthModule {}
