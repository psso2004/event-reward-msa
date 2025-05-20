import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Event } from '../../event/schemas/event.schema';
import { RewardType } from '../enums/reward-type.enum';

@Schema({ timestamps: true })
export class Reward extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ type: Types.ObjectId, ref: 'Event', required: true })
  eventId: Event;

  @Prop({
    type: String,
    enum: RewardType,
    required: true,
  })
  type: RewardType;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  description: string;
}

export const RewardSchema = SchemaFactory.createForClass(Reward);
RewardSchema.index({ eventId: 1 });
