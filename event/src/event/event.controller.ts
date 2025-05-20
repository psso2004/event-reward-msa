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

@Controller('event')
@EventServiceControllerMethods()
export class EventController implements EventServiceController {
  createEvent(
    request: CreateEventRequest,
  ): Promise<Event> | Observable<Event> | Event {
    throw new Error('Method not implemented.');
  }
  getEvent(
    request: GetEventRequest,
  ): Promise<Event> | Observable<Event> | Event {
    throw new Error('Method not implemented.');
  }
  getEvents(request: Empty): Promise<Events> | Observable<Events> | Events {
    throw new Error('Method not implemented.');
  }
  createReward(
    request: CreateRewardRequest,
  ): Promise<Reward> | Observable<Reward> | Reward {
    throw new Error('Method not implemented.');
  }
  getRewards(
    request: GetRewardsRequest,
  ): Promise<Rewards> | Observable<Rewards> | Rewards {
    throw new Error('Method not implemented.');
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
