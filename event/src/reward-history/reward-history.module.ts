import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RewardHistory,
  RewardHistorySchema,
} from './schemas/reward-history.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RewardHistory.name, schema: RewardHistorySchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class RewardHistoryModule {}
