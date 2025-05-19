import * as Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class LoginInputDto {
  @JoiSchema(Joi.string().required())
  email: string;

  @JoiSchema(Joi.string().required())
  password: string;
}
