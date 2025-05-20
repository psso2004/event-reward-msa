import * as Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import { RewardType } from 'src/grpc-client/protos/generated/event';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class CreateRewardInputDto {
  @JoiSchema(Joi.string().required())
  eventId: string;

  @JoiSchema(
    Joi.number()
      .valid(...Object.values(RewardType))
      .required(),
  )
  type: RewardType;

  @JoiSchema(Joi.number().required())
  quantity: number;

  @JoiSchema(Joi.string().required())
  description: string;
}
