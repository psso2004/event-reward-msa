import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/auth/enums/user-role.enum';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import {
  EventServiceClient,
  RewardHistories,
  Rewards,
} from 'src/grpc-client/protos/generated/event';
import { CreateRewardInputDto } from '../dtos/inputs/create-reward.input.dto';
import { Request } from 'express';
import { IPayload } from 'src/auth/interfaces/payload.interface';
import { GetRewardHistoriesQueryDto } from '../dtos/queries/get-reward-histories.query.dto';
import { RequestRewardInputDto } from '../dtos/inputs/request-reward.input.dto';
import { RewardOutputDto } from '../dtos/outputs/reward.output.dto';
import { RewardHistoryOutputDto } from '../dtos/outputs/reward-history.output.dto';

@Controller('reward')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RewardController {
  constructor(
    @Inject('EVENT_PACKAGE_SERVICE')
    private readonly eventService: EventServiceClient,
  ) {}

  @Roles(UserRole.OPERATOR, UserRole.ADMIN)
  @Post()
  async createReward(
    @Body()
    createRewardDto: CreateRewardInputDto,
  ): Promise<RewardOutputDto> {
    const response = await firstValueFrom(
      this.eventService.createReward(createRewardDto),
    );
    return RewardOutputDto.fromGrpcResponse(response);
  }

  @Get(':eventId')
  async getRewards(
    @Query('eventId') eventId: string,
  ): Promise<RewardOutputDto[]> {
    const response: Rewards = await firstValueFrom(
      this.eventService.getRewards({ eventId }),
    );
    return response.rewards.map((reward) =>
      RewardOutputDto.fromGrpcResponse(reward),
    );
  }

  @Roles(UserRole.USER, UserRole.ADMIN)
  @Post('request')
  async requestReward(
    @Body() requestRewardDto: RequestRewardInputDto,
  ): Promise<RewardHistoryOutputDto> {
    const response = await firstValueFrom(
      this.eventService.requestReward(requestRewardDto),
    );
    return RewardHistoryOutputDto.fromGrpcResponse(response);
  }

  @Roles(UserRole.AUDITOR, UserRole.ADMIN)
  @Get('history')
  async getRewardHistories(
    @Query() query: GetRewardHistoriesQueryDto,
  ): Promise<RewardHistoryOutputDto[]> {
    const response: RewardHistories = await firstValueFrom(
      this.eventService.getRewardHistories(query),
    );
    return response.rewardHistories.map((rewardHistory) =>
      RewardHistoryOutputDto.fromGrpcResponse(rewardHistory),
    );
  }
}
