import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RewardHistory } from './schemas/reward-history.schema';
import { RewardStatus } from './enums/reward-status.enum';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

@Injectable()
export class RewardHistoryService {
  constructor(
    @InjectModel(RewardHistory.name)
    private readonly rewardHistoryModel: Model<RewardHistory>,
  ) {}

  async findExistingRequest(
    userId: string,
    eventId: string,
  ): Promise<RewardHistory | null> {
    return this.rewardHistoryModel.findOne({
      userId,
      eventId,
      status: { $in: [RewardStatus.PENDING, RewardStatus.SUCCESS] },
    });
  }

  async createFailedHistory(data: {
    userId: string;
    eventId: string;
    rewardId: string;
    failureReason: string;
  }): Promise<RewardHistory> {
    const failedHistory = new this.rewardHistoryModel({
      ...data,
      status: RewardStatus.FAILED,
      requestedAt: new Date(),
    });
    return failedHistory.save();
  }

  async createPendingHistory(data: {
    userId: string;
    eventId: string;
    rewardId: string;
  }): Promise<RewardHistory> {
    const rewardHistory = new this.rewardHistoryModel({
      ...data,
      status: RewardStatus.PENDING,
      requestedAt: new Date(),
    });
    return rewardHistory.save();
  }

  async findHistories(query: {
    userId?: string;
    eventId?: string;
    status?: RewardStatus;
    startDate?: Date;
    endDate?: Date;
    offset?: number;
    limit?: number;
  }): Promise<{ histories: RewardHistory[]; total: number }> {
    const { offset = 0, limit = 20, ...filterQuery } = query;

    const histories = await this.rewardHistoryModel
      .find(filterQuery)
      .sort({ requestedAt: -1 })
      .skip(offset)
      .limit(limit);

    const total = await this.rewardHistoryModel.countDocuments(filterQuery);

    return { histories, total };
  }

  async updateHistoryStatus(
    historyId: string,
    data: {
      status: RewardStatus;
      failureReason?: string;
    },
  ): Promise<RewardHistory | null> {
    return this.rewardHistoryModel.findByIdAndUpdate(
      historyId,
      {
        ...data,
        completedAt: new Date(),
      },
      { new: true },
    );
  }
}
