import { JoiSchema, JoiSchemaOptions } from 'nestjs-joi';
import * as Joi from 'joi';
import { UserRole } from 'src/auth/enums/user-role.enum';

@JoiSchemaOptions({
  allowUnknown: false,
})
export class GetRewardHistoriesQueryDto {
  @JoiSchema(Joi.string().required())
  userId: string;

  @JoiSchema(
    Joi.string()
      .valid(...Object.values(UserRole))
      .required(),
  )
  userRole: UserRole;

  @JoiSchema(Joi.string())
  eventId?: string;
}
