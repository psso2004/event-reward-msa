import * as Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';

export enum UserRole {
  USER_UNSPECIFIED = 0,
  USER = 1,
  OPERATOR = 2,
  AUDITOR = 3,
  ADMIN = 4,
}

@JoiSchemaOptions({
  allowUnknown: false,
})
export class CreateUserInputDto {
  @JoiSchema(Joi.string().email().required())
  email: string;

  @JoiSchema(Joi.string().required())
  password: string;

  @JoiSchema(
    Joi.number()
      .valid(...Object.values(UserRole))
      .required(),
  )
  role: UserRole;
}
