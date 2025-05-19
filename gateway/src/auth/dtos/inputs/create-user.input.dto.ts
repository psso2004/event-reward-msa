import * as Joi from 'joi';
import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import { UserRole } from 'src/auth/enums/user-role.enum';

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
