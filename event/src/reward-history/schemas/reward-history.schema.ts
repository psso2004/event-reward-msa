import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Event } from '../../event/schemas/event.schema';
import { Reward } from '../../reward/schemas/reward.schema';
import { RewardStatus } from '../enums/reward-status.enum';
import { v4 as uuidv4 } from 'uuid';

@Schema({ timestamps: true, _id: false })
export class RewardHistory extends Document {
  @Prop({ type: String, default: () => uuidv4(), unique: true })
  declare id: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ type: String, ref: 'Event', required: true })
  eventId: Event;

  @Prop({ type: String, ref: 'Reward', required: true })
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
RewardHistorySchema.index({ id: 1 }, { unique: true });
