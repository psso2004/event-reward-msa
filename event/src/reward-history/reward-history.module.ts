import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import {
  RewardHistory,
  RewardHistorySchema,
} from './schemas/reward-history.schema';
import { RewardHistoryService } from './reward-history.service';
import { RewardHistoryProcessor } from './reward-history.processor';
import { RewardHistoryQueue } from './reward-history.queue';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'reward-request',
    }),
    MongooseModule.forFeature([
      { name: RewardHistory.name, schema: RewardHistorySchema },
    ]),
  ],
  providers: [RewardHistoryService, RewardHistoryProcessor, RewardHistoryQueue],
  exports: [RewardHistoryService, RewardHistoryQueue],
})
export class RewardHistoryModule {}
