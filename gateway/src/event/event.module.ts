import { Module } from '@nestjs/common';
import { GrpcClientModule } from 'src/grpc-client/grpc-client.module';
import { EventController } from './controllers/event.controller';
import { RewardController } from './controllers/reward.controller';

@Module({
  imports: [
    GrpcClientModule.forRootAsync({
      name: 'EVENT_PACKAGE',
      package: 'event',
      url: 'GRPC_EVENT_URL',
      serviceName: 'EventService',
    }),
  ],
  controllers: [EventController, RewardController],
})
export class EventModule {}
