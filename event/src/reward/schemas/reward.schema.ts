import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Event } from '../../event/schemas/event.schema';
import { RewardType } from '../enums/reward-type.enum';
import { v4 as uuidv4 } from 'uuid';

@Schema({ timestamps: true, _id: false })
export class Reward extends Document {
  @Prop({ type: String, default: () => uuidv4(), unique: true })
  declare id: string;

  @Prop({ type: String, ref: 'Event', required: true })
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
RewardSchema.index({ id: 1 }, { unique: true });
