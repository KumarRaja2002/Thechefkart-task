import { object, pipe, string, number, nonEmpty, regex, nullish, InferInput } from 'valibot';
import {
  USER_NAME_STRING,
  USER_NAME_REQUIRED,
  USER_MOBILE_NUMBER_VALID,
  USER_MOBILE_NUMBER_REQUIRED,
  USER_ADDRESS_REQUIRED,
  USER_POST_COUNT_INVALID,
} from '../constants/appMessages';

export const createUserSchema = object({
  name: pipe(
    string(USER_NAME_STRING),
    nonEmpty(USER_NAME_REQUIRED)
  ),
  mobile_number: pipe(
    string(USER_MOBILE_NUMBER_VALID),
    regex(/^\d{10}$/, USER_MOBILE_NUMBER_VALID),
    nonEmpty(USER_MOBILE_NUMBER_REQUIRED)
  ),
  address: pipe(
    string(USER_NAME_STRING),
    nonEmpty(USER_ADDRESS_REQUIRED)
  ),
  post_count: nullish(number(USER_POST_COUNT_INVALID)),
});

export type CreateUserInput = InferInput<typeof createUserSchema>;
