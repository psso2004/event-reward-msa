import { Module, Logger } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { GrpcClientModule } from 'src/grpc-client/grpc-client.module';

@Module({
  imports: [
    GrpcClientModule.forRootAsync({
      name: 'AUTH_PACKAGE',
      package: 'auth',
      url: 'GRPC_AUTH_URL',
      serviceName: 'AuthService',
    }),
  ],
  controllers: [AuthController],
})
export class AuthModule {
  private readonly logger = new Logger(AuthModule.name);

  constructor() {
    this.logger.log('AuthModule initialized');
  }
}
