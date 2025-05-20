import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { RewardHistoryService } from './reward-history.service';
import { RewardStatus } from './enums/reward-status.enum';

@Injectable()
@Processor('reward-request')
export class RewardHistoryProcessor {
  constructor(private readonly rewardHistoryService: RewardHistoryService) {}

  @Process('process-reward')
  async handleRewardRequest(job: Job) {
    const { userId, eventId, rewardId, historyId } = job.data;

    try {
      // 1. 보상 처리 로직 실행
      await this.processReward(userId, rewardId);

      // 2. 히스토리 상태 업데이트
      await this.rewardHistoryService.updateHistoryStatus(historyId, {
        status: RewardStatus.SUCCESS,
      });
    } catch (error) {
      // 3. 실패 시 상태 업데이트
      await this.rewardHistoryService.updateHistoryStatus(historyId, {
        status: RewardStatus.FAILED,
        failureReason: error.message,
      });

      throw error;
    }
  }

  private async processReward(userId: string, rewardId: string) {
    // TODO: 실제 보상 처리 로직 구현
    // 예: 포인트 지급, 아이템 지급, 쿠폰 발급 등
  }
}
