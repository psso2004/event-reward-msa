import { Reward, RewardType } from 'src/grpc-client/protos/generated/event';

export class RewardOutputDto {
  id: string;
  userId: string;
  eventId: string;
  type: RewardType;
  quantity: number;
  description: string;

  constructor(
    id: string,
    userId: string,
    eventId: string,
    type: RewardType,
    quantity: number,
    description: string,
  ) {
    this.id = id;
    this.userId = userId;
    this.eventId = eventId;
    this.type = type;
    this.quantity = quantity;
    this.description = description;
  }

  static fromGrpcResponse(response: Reward): RewardOutputDto {
    return new RewardOutputDto(
      response.id,
      response.userId,
      response.eventId,
      response.type,
      response.quantity,
      response.description,
    );
  }
}
