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
} from 'src/protos/generated/event';
import { Empty } from 'src/protos/generated/google/protobuf/empty';
import { EventService } from './event.service';

@Controller('event')
@EventServiceControllerMethods()
export class EventController implements EventServiceController {
  constructor(private readonly eventService: EventService) {}

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

  requestReward(
    request: RewardRequest,
  ): Promise<RewardHistory> | Observable<RewardHistory> | RewardHistory {
    throw new Error('Method not implemented.');
  }

  getRewardHistories(
    request: GetRewardHistoriesRequest,
  ): Promise<RewardHistories> | Observable<RewardHistories> | RewardHistories {
    throw new Error('Method not implemented.');
  }
}
