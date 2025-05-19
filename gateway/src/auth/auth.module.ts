import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { GrpcClientModule } from 'src/grpc-client/grpc-client.module';
import { UserController } from './controllers/user.controller';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';

@Module({
  imports: [
    GrpcClientModule.forRootAsync({
      name: 'AUTH_PACKAGE',
      package: 'auth',
      url: 'GRPC_AUTH_URL',
      serviceName: 'AuthService',
    }),
  ],
  providers: [JwtStrategy, JwtAuthGuard, RolesGuard],
  exports: [JwtStrategy, JwtAuthGuard, RolesGuard],
  controllers: [AuthController, UserController],
})
export class AuthModule {}
