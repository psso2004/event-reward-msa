import { Event, EventStatus } from 'src/grpc-client/protos/generated/event';

export class EventOutputDto {
  id: string;
  title: string;
  description: string;
  condition: string;
  startDate: string;
  endDate: string;
  status: EventStatus;

  constructor(
    id: string,
    title: string,
    description: string,
    condition: string,
    startDate: string,
    endDate: string,
    status: EventStatus,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.condition = condition;
    this.startDate = startDate;
    this.endDate = endDate;
    this.status = status;
  }

  static fromGrpcResponse(response: Event): EventOutputDto {
    return new EventOutputDto(
      response.id,
      response.title,
      response.description,
      response.condition,
      response.startDate,
      response.endDate,
      response.status,
    );
  }
}
