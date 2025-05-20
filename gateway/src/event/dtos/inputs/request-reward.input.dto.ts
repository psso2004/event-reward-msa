import * as Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class RequestRewardInputDto {
  @JoiSchema(Joi.string().required())
  userId: string;

  @JoiSchema(Joi.string().required())
  eventId: string;
}
