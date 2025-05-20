import { Controller, Get, Query } from '@nestjs/common';
import { EventService } from '../event.service';
import { getRewardHistoriesSchema } from '../schemas/get-reward-histories.schema';

@Controller('rewards')
export class RewardController {
  constructor(private readonly eventService: EventService) {}

  @Get('histories')
  async getRewardHistories(@Query() query) {
    const { error, value } = getRewardHistoriesSchema.validate(query);
    if (error) {
      throw error;
    }
    return this.eventService.getRewardHistories(value);
  }
}
