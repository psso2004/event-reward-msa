import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EventStatus } from '../enums/event-status.enum';
import { v4 as uuidv4 } from 'uuid';

@Schema({ timestamps: true })
export class Event extends Document {
  @Prop({ type: String, default: () => uuidv4(), unique: true })
  declare id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  condition: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({
    type: String,
    enum: EventStatus,
    default: EventStatus.ACTIVE,
  })
  status: EventStatus;
}

export const EventSchema = SchemaFactory.createForClass(Event);
EventSchema.index({ status: 1, startDate: 1, endDate: 1 });
EventSchema.index({ id: 1 }, { unique: true });
