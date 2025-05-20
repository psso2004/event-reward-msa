import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class RewardHistoryQueue {
  constructor(@InjectQueue('reward-request') private rewardQueue: Queue) {}

  async addRewardRequest(data: {
    userId: string;
    eventId: string;
    rewardId: string;
  }) {
    return this.rewardQueue.add('process-reward', data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    });
  }
}
