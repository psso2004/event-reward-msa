import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Event } from '../../event/schemas/event.schema';
import { Reward } from '../../reward/schemas/reward.schema';
import { RewardStatus } from '../enums/reward-status.enum';

@Schema({ timestamps: true })
export class RewardHistory extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
  eventId: Event;

  @Prop({ type: Types.ObjectId, ref: 'Reward', required: true })
  rewardId: Reward;

  @Prop({
    type: String,
    enum: RewardStatus,
    default: RewardStatus.PENDING,
  })
  status: RewardStatus;

  @Prop({ default: Date.now })
  requestedAt: Date;
}

export const RewardHistorySchema = SchemaFactory.createForClass(RewardHistory);
RewardHistorySchema.index({ userId: 1, eventId: 1 });
RewardHistorySchema.index({ status: 1, requestedAt: 1 });
