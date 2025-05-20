import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import * as Joi from 'joi';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class GetRewardHistoriesQueryDto {
  @JoiSchema(Joi.string())
  userId?: string;

  @JoiSchema(Joi.string())
  eventId?: string;
}
