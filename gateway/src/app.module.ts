import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { EventModule } from './event/event.module';
import { JoiPipeModule } from 'nestjs-joi';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GrpcErrorInterceptor } from './grpc-client/interceptors/grpc-error.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    EventModule,
    JoiPipeModule.forRoot({
      pipeOpts: {
        usePipeValidationException: true,
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: GrpcErrorInterceptor,
    },
  ],
})
export class AppModule {}
