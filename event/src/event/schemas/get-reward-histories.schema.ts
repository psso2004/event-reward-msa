import Joi from 'joi';
import { UserRole } from 'src/protos/generated/event';

export const getRewardHistoriesSchema = Joi.object({
  userId: Joi.string().required(),
  userRole: Joi.number()
    .valid(
      ...Object.values(UserRole).filter((value) => typeof value === 'number'),
    )
    .required(),
  eventId: Joi.string().optional(),
  status: Joi.string().optional(),
  startDate: Joi.string().optional(),
  endDate: Joi.string().optional(),
  offset: Joi.string().optional(),
  limit: Joi.string().optional(),
});
