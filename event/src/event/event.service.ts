import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from './schemas/event.schema';
import { Reward } from './schemas/reward.schema';
import {
  CreateEventRequest,
  CreateRewardRequest,
  Event as EventProto,
  Events,
  GetRewardsRequest,
  Reward as RewardProto,
  Rewards,
} from 'src/protos/generated/event';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { RewardHistoryQueue } from '../reward-history/reward-history.queue';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
    @InjectModel(Reward.name) private readonly rewardModel: Model<Reward>,
    private readonly rewardHistoryQueue: RewardHistoryQueue,
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

  async createReward(request: CreateRewardRequest): Promise<RewardProto> {
    const event = await this.eventModel.findOne({ id: request.eventId });
    if (!event) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'Event not found',
      });
    }

    const reward = new this.rewardModel({
      eventId: request.eventId,
      type: request.type,
      quantity: request.quantity,
      description: request.description,
    });

    const savedReward = await reward.save();
    return this.mapRewardToProto(savedReward);
  }

  async getRewards(request: GetRewardsRequest): Promise<Rewards> {
    const event = await this.eventModel.findOne({ id: request.eventId });
    if (!event) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'Event not found',
      });
    }

    const rewards = await this.rewardModel.find({ eventId: request.eventId });
    return {
      rewards: rewards.map((reward) => this.mapRewardToProto(reward)),
    };
  }

  async validateEventCondition(
    userId: string,
    eventId: string,
  ): Promise<boolean> {
    const event = await this.eventModel.findOne({ id: eventId });
    if (!event) {
      return false;
    }

    // TODO: 이벤트 조건 검증 로직 구현
    // 예: 사용자의 활동 내역 확인, 포인트 확인 등
    return true;
  }

  async processRewardRequest(data: {
    userId: string;
    eventId: string;
    rewardId: string;
    historyId: string;
  }) {
    return this.rewardHistoryQueue.addRewardRequest(data);
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

  private mapRewardToProto(reward: Reward): RewardProto {
    return {
      id: reward.id,
      eventId: reward.eventId.toString(),
      type: reward.type,
      quantity: reward.quantity,
      description: reward.description,
    };
  }
}
