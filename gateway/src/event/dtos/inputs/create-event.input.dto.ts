import * as Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import { EventStatus } from 'src/grpc-client/protos/generated/event';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class CreateEventInputDto {
  @JoiSchema(Joi.string().required())
  title: string;

  @JoiSchema(Joi.string().required())
  description: string;

  @JoiSchema(Joi.string().required())
  condition: string;

  @JoiSchema(Joi.string().isoDate().required())
  startDate: string;

  @JoiSchema(Joi.string().isoDate().required())
  endDate: string;

  @JoiSchema(
    Joi.number()
      .valid(...Object.values(EventStatus))
      .required(),
  )
  status: EventStatus;
}
