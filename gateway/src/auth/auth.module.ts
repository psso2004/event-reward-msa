import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { GrpcClientModule } from 'src/grpc-client/grpc-client.module';

@Module({
  imports: [
    GrpcClientModule.forRootAsync({
      name: 'AUTH_PACKAGE',
      package: 'auth',
      url: 'GRPC_AUTH_URL',
    }),
  ],
  controllers: [AuthController],
})
export class AuthModule {}
