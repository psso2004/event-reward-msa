import {
  RewardHistory,
  RewardStatus,
} from 'src/grpc-client/protos/generated/event';

export class RewardHistoryOutputDto {
  eventId: string;
  rewardId: string;
  status: RewardStatus;
  requestedAt: string;

  constructor(
    eventId: string,
    rewardId: string,
    status: RewardStatus,
    requestedAt: string,
  ) {
    this.eventId = eventId;
    this.rewardId = rewardId;
    this.status = status;
    this.requestedAt = requestedAt;
  }

  static fromGrpcResponse(response: RewardHistory): RewardHistoryOutputDto {
    return new RewardHistoryOutputDto(
      response.eventId,
      response.rewardId,
      response.status,
      response.requestedAt,
    );
  }
}
