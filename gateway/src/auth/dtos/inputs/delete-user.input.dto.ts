import * as Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class DeleteUserInputDto {
  @JoiSchema(Joi.string().required())
  id: string;
}
