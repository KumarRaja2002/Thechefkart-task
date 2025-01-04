import { object, pipe, string, number, array, nonEmpty, nullish, InferInput } from 'valibot';
import {
  POST_TITLE_STRING,
  POST_TITLE_REQUIRED,
  POST_DESCRIPTION_STRING,
  POST_DESCRIPTION_REQUIRED,
  POST_IMAGES_ARRAY,
  POST_USER_ID_REQUIRED,
  POST_USER_ID_VALID,
} from '../constants/appMessages';

export const createPostSchema = object({
  title: pipe(
    string(POST_TITLE_STRING),
    nonEmpty(POST_TITLE_REQUIRED)
  ),
  description: pipe(
    string(POST_DESCRIPTION_STRING),
  ),
  user_id: nullish(number(POST_USER_ID_VALID)),
  images: nullish(array(string(POST_IMAGES_ARRAY))),
});

export type CreatePostInput = InferInput<typeof createPostSchema>;
