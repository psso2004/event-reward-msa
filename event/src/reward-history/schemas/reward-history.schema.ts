import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { RewardStatus } from '../enums/reward-status.enum';
import { v4 as uuidv4 } from 'uuid';

@Schema({ timestamps: true })
export class RewardHistory extends Document {
  @Prop({ type: String, default: () => uuidv4(), unique: true })
  declare id: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ type: String, required: true })
  eventId: string;

  @Prop({ type: String, required: true })
  rewardId: string;

  @Prop({
    type: String,
    enum: RewardStatus,
    default: RewardStatus.PENDING,
  })
  status: RewardStatus;

  @Prop({ default: Date.now })
  requestedAt: Date;

  @Prop()
  failureReason?: string;

  @Prop()
  completedAt?: Date;
}

export const RewardHistorySchema = SchemaFactory.createForClass(RewardHistory);
RewardHistorySchema.index({ userId: 1, eventId: 1 });
RewardHistorySchema.index({ status: 1, requestedAt: 1 });
RewardHistorySchema.index({ id: 1 }, { unique: true });
