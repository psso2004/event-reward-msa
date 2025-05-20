import { Controller } from '@nestjs/common';
import { Observable } from 'rxjs';
import {
  CreateEventRequest,
  CreateRewardRequest,
  Event,
  Events,
  EventServiceController,
  EventServiceControllerMethods,
  GetEventRequest,
  GetRewardHistoriesRequest,
  GetRewardsRequest,
  Reward,
  RewardHistories,
  RewardHistory,
  RewardRequest,
  Rewards,
  UserRole,
} from 'src/protos/generated/event';
import { Empty } from 'src/protos/generated/google/protobuf/empty';
import { RewardHistoryService } from '../reward-history/reward-history.service';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { EventService } from './event.service';

@Controller('event')
@EventServiceControllerMethods()
export class EventController implements EventServiceController {
  constructor(
    private readonly eventService: EventService,
    private readonly rewardHistoryService: RewardHistoryService,
  ) {}

  createEvent(request: CreateEventRequest): Promise<Event> {
    return this.eventService.createEvent(request);
  }

  getEvent(request: GetEventRequest): Promise<Event> {
    return this.eventService.getEvent(request.eventId);
  }

  getEvents(request: Empty): Promise<Events> {
    return this.eventService.getEvents();
  }

  createReward(request: CreateRewardRequest): Promise<Reward> {
    return this.eventService.createReward(request);
  }

  getRewards(request: GetRewardsRequest): Promise<Rewards> {
    return this.eventService.getRewards(request);
  }

  async requestReward(request: RewardRequest): Promise<RewardHistory> {
    // 1. 이벤트 존재 여부 확인
    const event = await this.eventService.getEvent(request.eventId);
    if (!event) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'Event not found',
      });
    }

    // 2. 보상 존재 여부 확인
    const rewards = await this.eventService.getRewards({
      eventId: request.eventId,
    });
    if (!rewards.rewards.length) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: 'No rewards found for this event',
      });
    }

    // 3. 중복 요청 체크
    const existingRequest = await this.rewardHistoryService.findExistingRequest(
      request.userId,
      request.eventId,
    );

    if (existingRequest) {
      throw new RpcException({
        code: status.ALREADY_EXISTS,
        message: 'Reward already requested or received',
      });
    }

    // 4. 이벤트 조건 검증
    const isConditionMet = await this.eventService.validateEventCondition(
      request.userId,
      request.eventId,
    );

    if (!isConditionMet) {
      // 조건 미달 시 실패 상태로 기록
      await this.rewardHistoryService.createFailedHistory({
        userId: request.userId,
        eventId: request.eventId,
        rewardId: rewards.rewards[0].id,
        failureReason: 'Event condition not met',
      });

      throw new RpcException({
        code: status.FAILED_PRECONDITION,
        message: 'Event condition not met',
      });
    }

    // 5. 보상 요청 생성
    const savedHistory = await this.rewardHistoryService.createPendingHistory({
      userId: request.userId,
      eventId: request.eventId,
      rewardId: rewards.rewards[0].id,
    });

    // 6. BullMQ를 통한 비동기 보상 처리
    await this.eventService.processRewardRequest({
      userId: request.userId,
      eventId: request.eventId,
      rewardId: rewards.rewards[0].id,
      historyId: savedHistory.id,
    });

    return {
      eventId: savedHistory.eventId,
      rewardId: savedHistory.rewardId,
      status: savedHistory.status,
      requestedAt: savedHistory.requestedAt.toISOString(),
      failureReason: savedHistory.failureReason,
    };
  }

  async getRewardHistories(
    request: GetRewardHistoriesRequest,
  ): Promise<RewardHistories> {
    const query: any = {};

    // 권한에 따른 조회 범위 설정
    if (request.userRole === UserRole.USER) {
      query.userId = request.userId;
    }

    // 필터링 조건 적용
    if (request.eventId) {
      query.eventId = request.eventId;
    }
    if (request.status) {
      query.status = request.status;
    }
    if (request.startDate && request.endDate) {
      query.requestedAt = {
        $gte: new Date(request.startDate),
        $lte: new Date(request.endDate),
      };
    }

    const { histories, total } = await this.rewardHistoryService.findHistories({
      ...query,
      offset: request.offset,
      limit: request.limit,
    });

    return {
      rewardHistories: histories.map((history) => ({
        eventId: history.eventId,
        rewardId: history.rewardId,
        status: history.status,
        requestedAt: history.requestedAt.toISOString(),
        failureReason: history.failureReason,
      })),
      total,
    };
  }
}
