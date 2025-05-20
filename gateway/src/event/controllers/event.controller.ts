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
  Events,
  EventServiceClient,
} from 'src/grpc-client/protos/generated/event';
import { CreateEventInputDto } from '../dtos/inputs/create-event.input.dto';
import { Request } from 'express';
import { IPayload } from 'src/auth/interfaces/payload.interface';
import { EventOutputDto } from '../dtos/outputs/event.output.dto';

@Controller('event')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EventController {
  constructor(
    @Inject('EVENT_PACKAGE_SERVICE')
    private readonly eventService: EventServiceClient,
  ) {}

  @Roles(UserRole.OPERATOR, UserRole.ADMIN)
  @Post()
  async createEvent(
    @Body()
    createEventDto: CreateEventInputDto,
  ): Promise<EventOutputDto> {
    const response = await firstValueFrom(
      this.eventService.createEvent(createEventDto),
    );
    return EventOutputDto.fromGrpcResponse(response);
  }

  @Get(':eventId')
  async getEvent(@Query('eventId') eventId: string): Promise<EventOutputDto> {
    const response = await firstValueFrom(
      this.eventService.getEvent({ eventId }),
    );
    return EventOutputDto.fromGrpcResponse(response);
  }

  @Get()
  async getEvents(): Promise<EventOutputDto[]> {
    const response: Events = await firstValueFrom(
      this.eventService.getEvents({}),
    );
    return response.events.map((event) =>
      EventOutputDto.fromGrpcResponse(event),
    );
  }
}
