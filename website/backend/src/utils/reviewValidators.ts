import { z } from 'zod';

export const CreateReviewSchema = z.object({
  rating: z.number({
    required_error: 'Rating is required',
    invalid_type_error: 'Rating must be a number',
  }).min(1, 'Rating must be at least 1').max(5, 'Rating cannot be more than 5'),
  review: z.string({
    required_error: 'Review text is required',
  }).min(1, 'Review cannot be empty').max(1000, 'Review cannot be more than 1000 characters'),
});
