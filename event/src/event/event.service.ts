import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from './schemas/event.schema';
import {
  CreateEventRequest,
  Event as EventProto,
  Events,
} from 'src/protos/generated/event';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
  ) {}

  async createEvent(request: CreateEventRequest): Promise<EventProto> {
    const event = new this.eventModel({
      title: request.title,
      description: request.description,
      condition: request.condition,
      startDate: new Date(request.startDate),
      endDate: new Date(request.endDate),
      status: request.status,
    });

    const savedEvent = await event.save();
    return this.mapToProto(savedEvent);
  }

  async getEvent(eventId: string): Promise<EventProto> {
    const event = await this.eventModel.findOne({ id: eventId });
    if (!event) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'Event not found',
      });
    }
    return this.mapToProto(event);
  }

  async getEvents(): Promise<Events> {
    const events = await this.eventModel.find();
    return {
      events: events.map((event) => this.mapToProto(event)),
    };
  }

  private mapToProto(event: Event): EventProto {
    return {
      id: event.id,
      title: event.title,
      description: event.description,
      condition: event.condition,
      startDate: event.startDate.toISOString(),
      endDate: event.endDate.toISOString(),
      status: event.status,
    };
  }
}
